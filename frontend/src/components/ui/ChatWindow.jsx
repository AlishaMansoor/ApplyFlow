import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import axios from 'axios';
import { AuthDataContext } from '../../context/AuthContext';
import { UserDataContext } from '../../context/UserContext';
import { ChatDataContext } from '../../context/ChatContext';
import { IoMdArrowBack } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';


const ChatWindow = ({ isModal = false }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const { userData } = useContext(UserDataContext);
  const { setActiveDesktopTab,
    chats,
    setChats,
    setUnreadCount,
    setDesktopChatModal,
    selectedConversation,
    setSelectedConversation,
    socket,
    fetchUnreadCount } = useContext(ChatDataContext);
  const conversation = selectedConversation;

  const navigate = useNavigate();
  const currentUserId = userData._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null); // Tracks typing timer context

  const messageRef = useRef(null);

  
  
  React.useEffect(() => {
  // This executes once when ChatWindow mounts
  
  return () => {
    // This ONLY runs when the entire ChatWindow component leaves the DOM tree
    setSelectedConversation(null); 
  };
}, []);



  
  //for joining chat room and leaving when user navigates away or closes the chat window
  React.useEffect(() => {
    if (!socket || !conversation?._id) return;
    socket.emit('join-conversation', conversation._id);

    setChats(prevChats => {
      const targetChat = prevChats.find(c => c._id === conversation._id);
      const countToSubtract = targetChat?.unreadCount || 0;

      // Deduct this specific count from the navbar total safely
      if (countToSubtract > 0) {
        setUnreadCount(prevTotal => Math.max(0, prevTotal - countToSubtract));
      }

      // Return the updated chats array with the cleared badge
      return prevChats.map(chat =>
        chat._id === conversation._id ? { ...chat, unreadCount: 0 } : chat
      );
    });
    return () => {
      socket.emit('leave-conversation', conversation._id);
      // setSelectedConversation(null);
    };
  }, [conversation?._id, socket]);





  //Other participant's detail to display in header
  const recipient = conversation?.participants?.find(p => p._id !== currentUserId) || {
    firstName: "User",
    profileImage: ""
  };





  //fetching previous messages
  const fetchMessageHistory = async () => {
    try {
      if (!conversation?._id || !serverUrl) return;
      setLoading(true);
      const result = await axios.get(`${serverUrl}/api/messages/${conversation._id}`, { withCredentials: true });
      setMessages(result.data.messages || []);
      // console.log("Messages fetched successfully", result.data.messages);
    } catch (e) {
      console.error("Frontend Error in fetching old Messages", e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }





  //Loading old messages, whenever new chat selected/page mounts.
  useEffect(() => {
    fetchMessageHistory();
  }, [conversation?._id]);


  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);






  useEffect(() => {
    if (!socket) return;

    socket.on('new-message-received', (incomingMessage) => {
      if (incomingMessage.conversationId?.toString() === conversation?._id?.toString()) {
        setMessages(prev => [...prev, incomingMessage]);
      }
      if (incomingMessage.conversationId.toString() !== conversation?._id?.toString()) {
        fetchUnreadCount();
      }
    });
    return () => socket.off('new-message-received');
  }, [socket, conversation?._id, currentUserId]);





  useEffect(() => {
    if (!socket) return;


    // listening for typing indicators from backend
    socket.on('user-typing', ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setIsTyping(true);
      }
    });


    // listening for typing indicators from backend
    socket.on('user-stopped-typing', ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setIsTyping(false);
      }
    });

    // Cleanup socket listeners on unmount or when conversation changes
    return () => {
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [socket, conversation?._id]);



  useEffect(() => {
    const draft = localStorage.getItem(`draft_${conversation?._id}`);
    if (draft) {
      setNewMessage(draft);
    }
  }, [conversation?._id])





  // Send message Api to the backend (Not used send-message event using ws api, instead using REST API to store message in DB and then emit the new-message-received event from backend to all participants)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const result = await axios.post(`${serverUrl}/api/messages/${conversation._id}`, { text: newMessage.trim() }, { withCredentials: true });

      const { message: savedMessage } = result.data;

      setNewMessage("");
      localStorage.removeItem(`draft_${conversation?._id}`);

      // Updating chats state locally, no apis. to set lastMessage in the conversation list
      setChats(prev => prev.map(chat =>
        chat._id === conversation._id
          ? { ...chat, lastMessage: newMessage.trim() }
          : chat
      ));


      if (socket && savedMessage) {
        socket.emit('send-message', {
          conversationId: conversation._id,
          message: savedMessage,
          // Passing the receiverId so the backend knows exactly whose badge to bump
          receiverId: conversation.participants.find(p => p._id !== userData._id)?._id
        });
        // console.log(`'send-message' event sent from frontend! with conversationId: ${conversation._id}.`);
      }


    } catch (e) {
      console.error("Error in sending message", e.message || e.response?.data?.message);
    }
  }



  //routing Back
  const handleBackNavigation = () => {
    if (isModal) {
      setActiveDesktopTab('ChatWindow');
      setSelectedConversation(null);
    } else {
      setSelectedConversation(null);
      // Navigate(-1);
    }
  };




  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    localStorage.setItem(`draft_${conversation?._id}`, e.target.value); // Save draft to localStorage
    if (!socket) return;

    // Emit typing event to the backend for sender typing 
    socket.emit('typing', { conversationId: conversation._id });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // new countdown timer to stop the indicator after 2 seconds of silence
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { conversationId: conversation._id });
    }, 2000); // 2 seconds of inactivity

  }




  //marking all messages as read, when conversation opens
  useEffect(() => {
    if (!conversation?._id) return;

    const markAsRead = async () => {
      try {
        await axios.put(
          `${serverUrl}/api/messages/mark-read/${conversation._id}`,
          {},
          { withCredentials: true }
        );

        fetchUnreadCount(); // refresh the dot count
      } catch (e) {
        console.error("Error updating read records:", e.message);
      }
    }
    markAsRead();
  }, [conversation?._id]);




  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200 flex-shrink-0">
        <IoMdArrowBack
          onClick={handleBackNavigation}
          className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
        />
        {recipient.profileImage ? (
          <img src={recipient.profileImage} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-sm">
            {recipient.firstName?.charAt(0)}
          </div>
        )}
        <p className="text-sm font-medium text-gray-800">
          {recipient.firstName} {recipient.lastName}
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {loading && (
          <p className="text-gray-400 text-sm text-center mt-4">Loading messages...</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-4">No messages yet. Say hi!</p>
        )}

        {!loading && messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words  whitespace-pre-wrap
              ${msg.senderId?.toString() === currentUserId?.toString()
                ? 'bg-emerald-500 text-white self-end rounded-br-none'
                : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'}`}
          >
            {msg.text}
          </div>
        ))}


        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start flex items-center gap-1 px-3 py-2 
                    bg-gray-100 rounded-xl rounded-bl-none max-w-[70px]">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}


        <div ref={messageRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-200 flex-shrink-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 border-2 border-gray-300 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full
                     w-9 h-9 flex items-center justify-center flex-shrink-0"
        >
          <IoSend className="w-4 h-4" />
        </button>
      </form>

    </div>
  )
}

export default ChatWindow
