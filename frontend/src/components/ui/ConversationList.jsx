import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext.jsx'
import { AuthDataContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { RxCheck, RxCross2 } from 'react-icons/rx'
import { IoChevronForward } from 'react-icons/io5'
import { FaCross, FaUserCircle } from 'react-icons/fa'
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowBack } from 'react-icons/io';
import Sidebar from '../layout/Sidebar.jsx';
import Navbar from '../layout/Navbar.jsx';
import { ChatDataContext } from '../../context/ChatContext.jsx';



const ConversationList = ({ onClose, isModal = false }) => {



  const { userData } = React.useContext(UserDataContext);
  const { serverUrl } = React.useContext(AuthDataContext);
  const { chats,
    setChats,
    fetchChats,
    requestCount,
    setRequestCount,
    requestData,
    setRequestData,
    selectedConversation,
    setSelectedConversation,
    fetchRequestData,
    fetchRequestCount,
    setActiveDesktopTab,
    invites,
    setInvites,
    fetchInvites,
    activeSection,
    setActiveSection } = React.useContext(ChatDataContext);
  const [requestsModal, setRequestsModal] = React.useState(false);
  const [inviteModal, setInviteModal] = React.useState(false);

  const [loadingRequests, setLoadingRequests] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState([]);
  const navigate = useNavigate()

  const location = useLocation();


  React.useEffect(() => {
    if (activeSection === 'invites') {
      setInviteModal(true);
      fetchInvites();
      setActiveSection(null); // reset after opening
    } else if (activeSection === 'requests') {
      setRequestsModal(true);
      setActiveSection(null); // reset after opening
    }

    // from location.state (small screen — navigation)
    if (location.state?.targetSection) {
      const target = location.state.targetSection;
      if (target === 'invites') {
        setInviteModal(true);
        // console.log("i can do both!");
        fetchInvites();
      } else if (target === 'requests') {
        setRequestsModal(true);
        // console.log("Nails, hair, hips, heels!");
      }

      // Clearing the history state immediately so it doesn't re-trigger on next render
      window.history.replaceState({ ...location.state, targetSection: undefined }, document.title);
    }


  }, [activeSection, location.state]);

  React.useEffect(() => {
    const targetUserId = location.state?.autoSelectUserId;

    if (targetUserId && chats.length > 0) {
      const matchingChat = chats.find(c =>
        c.participants.some(p => p._id === targetUserId)
      );
      if (matchingChat) {
        setSelectedConversation(matchingChat);
        window.history.replaceState({ ...location.state, autoSelectUserId: undefined }, document.title);
      }
    }
  }, [chats, location.state?.autoSelectUserId]);



  const acceptRequest = async (connectionId) => {
    if (loadingRequests.includes(connectionId)) return;

    setLoadingRequests(prev => [...prev, connectionId]);
    try {
      const result = await axios.put(`${serverUrl}/api/connection/accept/${connectionId}`, { status: 'accepted' }, { withCredentials: true });

      if (result.status === 200) {
        const { conversation } = result.data;

        if (conversation) {
          setChats(prev => [conversation, ...prev]);
        }
        setRequestCount(c => Math.max(0, c - 1));
        // setSelectedConversation(conversation);
        setRequestData(prev => prev.filter(req => req._id !== connectionId));
      }
    } catch (e) {
      console.error("Error in accepting Request: ", e.response?.data?.message || e.message);
    } finally {
      setLoadingRequests(prev => prev.filter(id => id !== connectionId));
    }
  }

  const rejectRequest = async (connectionId) => {
    if (loadingInvites.includes(connectionId)) return;

    setLoadingRequests(prev => [...prev, connectionId]);
    try {
      const result = await axios.put(`${serverUrl}/api/connection/reject/${connectionId}`, { status: 'rejected' }, { withCredentials: true });
      if (result.status === 200) {
        setRequestData(a => a.filter(b => b._id !== connectionId));
        setRequestCount(c => Math.max(0, c - 1));
      }

    } catch (e) {
      console.error("Error in rejecting Request: ", e.response?.data?.message || e.message);
    } finally {
      setLoadingRequests(prev => prev.filter(id => id !== connectionId));
    }
  }



  const acceptInvite = async (inviteId) => {
    if (loadingInvites.includes(inviteId)) return;

    setLoadingInvites(prev => [...prev, inviteId]);
    try {
      const result = await axios.put(`${serverUrl}/api/invite/accept/${inviteId}`, {}, { withCredentials: true });

      if (result.status === 200) {
        const { conversation } = result.data;

        setInvites(prev => prev.filter(item => item._id !== inviteId));

        if (conversation) {
          setChats(prev => [conversation, ...prev]);
          // setSelectedConversation(conversation);
          // navigate('/conversations'); || 
        }
      }

    } catch (e) {
      console.error("Error in rejecting Invite: ", e.response?.data?.message || e.message);
    } finally {
      setLoadingInvites(prev => prev.filter(id => id !== inviteId));
    }
  }

  const rejectInvite = async (inviteId) => {
    if (loadingInvites.includes(inviteId)) return;

    setLoadingInvites(prev => [...prev, inviteId]);
    try {
      const result = await axios.put(`${serverUrl}/api/invite/reject/${inviteId}`, {}, { withCredentials: true });
      if (result.status === 200) {
        setInvites(a => a.filter(b => inviteId !== b._id))
      }

    } catch (e) {
      console.error("Error in rejecting Invite: ", e.response?.data?.message || e.message);
    } finally {
      setLoadingInvites(prev => prev.filter(id => id !== inviteId));
    }
  }


  // {selectedConversation ? naviagte to='/'}

  const handleChatClick = async (chat) => {
    setSelectedConversation(chat);
    setActiveDesktopTab('MessageWindow')
    // setChats(prevChats => prevChats.map(c => 
    //     c._id === chat._id ? { ...c, unreadCount: 0 } : c
    // ));
    // setUnreadCount(prev => Math.max(0, prev - (chat.unreadCount || 0)));
  }





  return (
    <div className={`w-full bg-gray-50 ${isModal ? 'h-full' : 'h-full md:w-86 '} h-full overflow-y-auto  flex flex-col items-start justify-start  `}>

      {/* Header */}
      <div className="p-4  w-full border-b border-gray-200 flex items-center justify-start flex-shrink-0">
        <h2 className="font-semibold  w-full text-gray-700 text-xl">Messages</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 md:block">
            <RxCross2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Requests row */}
      <div
        onClick={() => setRequestsModal(!requestsModal)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer 
                   hover:bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <span className="text-base lg:text-sm font-medium bg-gray-50 text-gray-700">
          Requests{` (${requestCount})`}
        </span>
        {requestsModal ?
          <FaAngleUp
            // onClick={() => { fetchRequestData() }} 
            className=" w-5 h-5 bg-gray-50 text-gray-500" />
          :
          <FaAngleDown

            onClick={() => { fetchRequestData() }}
            className=" w-5 h-5 bg-gray-50 text-gray-500" />}


      </div>
      {requestData && requestsModal && (
        <div className="w-full min-h-16 border-b rounded-b-xl  border-gray-200 h-auto shadow-md flex flex-col justify-start items-start p-2">
          {requestCount === 0 && <p className="text-sm pl-3 mt-3 text-gray-600 font-normal italic">
            You do not have any new request.</p>}
          {requestData.map((req, index) => {
            const isRequestLoading = loadingRequests.includes(req._id);
            return (
              <div key={index} className="w-full flex items-center  justify-between p-2 ">
                <div className=" flex gap-2">
                  <img src={req.senderId.profileImage || null} alt="" className="w-10 h-10 rounded-full border " />
                  <div className="">
                    <p className="text-sm  text-gray-500">{req.senderId.firstName}-{req.senderId.lastName}</p>
                    <p className="text-xs italic text-gray-500">@{req.senderId.userName}</p>
                  </div>
                </div>
                
                 <div className="flex items-center min-w-[50px] justify-end">
                      {isRequestLoading ? (
                        /* Single shared spinner shown during accept OR reject */
                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        /* Normal Buttons */
                        <div className="flex gap-3">
                          <button onClick={() => rejectRequest(req._id)}>
                            <RxCross2 className="w-5 h-5 stroke-[1] text-red-500 hover:text-red-600" />
                          </button>
                          <button onClick={() => acceptRequest(req._id)}>
                            <FaCheck className="w-4 h-4 text-emerald-600 hover:text-emerald-700" />
                          </button>
                        </div>
                      )}
                    </div>
              </div>
            )
          })}
        </div>
      )}
      {/* Invites row */}
      {userData.userType === 'candidate' &&
        <div
          onClick={() => { setInviteModal(!inviteModal); if (!inviteModal) fetchInvites(); }}
          className="w-full flex items-center justify-between px-4 py-3 cursor-pointer 
                   hover:bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <span className="text-base lg:text-sm font-medium bg-gray-50 text-gray-700">
            Invites ({invites.length})
          </span>
          {inviteModal ?
            <FaAngleUp
              // onClick={() => { fetchRequestData() }} 
              className=" w-5 h-5 bg-gray-50 text-gray-500" />
            :
            <FaAngleDown

              //  onClick={() => { fetchInvites() }} 
              className=" w-5 h-5 bg-gray-50 text-gray-500" />}


        </div>}
      {userData.userType === 'candidate' && (
        <div className='w-full'>
          {invites && inviteModal && (
            <div className="w-full min-h-16 border-b rounded-b-xl  border-gray-200 h-auto shadow-md flex flex-col justify-start items-start p-2">
              {invites.length === 0 && <p className="text-sm mt-3 pl-3 text-gray-600 font-normal italic">
                You do not have any new Invites.</p>}
              {invites.map((req, index) => {
                const isInviteLoading = loadingInvites.includes(req._id);
                return (
                  <div key={req._id || index} className="w-full flex items-center  justify-between p-2 ">
                    <div className="flex flex-col w-full">
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        {req.jobId?.title} · {req.jobId?.companyName}
                      </p>
                      <div className="w-full flex gap-2">

                        <img src={req.senderId.profileImage || null} alt="" className="w-10 h-10 rounded-full border " />
                        <div className="w-full">
                          <p className="text-sm  text-gray-500">{req.senderId.firstName}-{req.senderId.lastName}</p>
                          <p className="text-xs italic text-gray-500">@{req.senderId.userName}</p>

                        </div>
                      </div>
                    </div>

                  
                    <div className="flex items-center min-w-[50px] justify-end">
                      {isInviteLoading ? (
                        /* Single shared spinner shown during accept OR reject */
                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        /* Normal Buttons */
                        <div className="flex gap-3">
                          <button onClick={() => rejectInvite(req._id)}>
                            <RxCross2 className="w-5 h-5 stroke-[1] text-red-500 hover:text-red-600" />
                          </button>
                          <button onClick={() => acceptInvite(req._id)}>
                            <FaCheck className="w-4 h-4 text-emerald-600 hover:text-emerald-700" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}


      {/* Conversations */}
      <div className="flex-1  w-full overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No conversations yet</p>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.participants?.find(p => p._id !== userData?._id)

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50
                  ${selectedConversation?._id === chat._id ? 'bg-emerald-50' : ''}`}
              >
                <div className=" relative flex gap-1 w-full">
                  <div className="flex-shrink-0">
                    {otherUser?.profileImage ? (
                      <img
                        src={otherUser.profileImage}
                        className=" w-11 h-11 rounded-full object-cover flex-shrink-0" alt='Profile'
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
                        {otherUser?.firstName ? (
                          otherUser.firstName.charAt(0).toUpperCase()
                        ) : (
                          <FaUserCircle className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                    )}
                    {chat.unreadCount > 0 && (
                      <span className="absolute top-5 right-3 bg-red-500 text-white text-[10px] font-medium flex justify-center items-center
                         rounded-full w-4 h-4 ">{chat.unreadCount}</span>
                    )}
                  </div>


                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {otherUser?.firstName} {otherUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      @{otherUser?.userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5 block max-w-[180px] sm:max-w-[220px] ">
                      {chat.lastMessage || 'Start a conversation'}

                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ConversationList