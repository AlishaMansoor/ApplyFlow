import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthDataContext } from './AuthContext.jsx';
import { UserDataContext } from './UserContext.jsx';
import { io } from 'socket.io-client';

export const ChatDataContext = createContext();

const ChatContext = ({ children }) => {




    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);
    const isRecruiter = userData?.userType === "recruiter";
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    //messaging data states
    const [chats, setChats] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const [requestData, setRequestData] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(false);
    const [invites, setInvites] = useState([]);

    //desktop layout views
    const [desktopChatModal, setDesktopChatModal] = useState(false);
    const [activeDesktopTab, setActiveDesktopTab] = useState('ChatWindow'); // ChatWindow/MessageWindow
    const [unreadCount, setUnreadCount] = useState(0);


    const [activeSection, setActiveSection] = useState(null);
    //  nothing auto-opened,'invites' = open invites,'requests' = open requests


    const [notificationCount, setNotificationCount] = useState(0)
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        if (!serverUrl || !userData?._id) return;

        //Establish handshake connection with backend server URL
        const socketInstance = io(serverUrl, {
            query: { userId: userData._id },
            withCredentials: true,
        });
        setSocket(socketInstance);

        // Listen for the global online us4ers array sent from the server
        socketInstance.on('get-online-users', (users) => {
            setOnlineUsers(users);
        });

        //CLEANUP: Disconnect automatically if the user logs out or closes the app
        return () => {
            socketInstance.disconnect();
            setSocket(null);
        };
    }, [serverUrl, userData?._id]);


   
    //Apis

    const fetchRequestData = async () => {
        try {
            // console.log("getRequestsData route hit!");
            const result = await axios.get(`${serverUrl}/api/connection/all`, { withCredentials: true });
            // console.log("api fetched all the requests.")
            setRequestData(result.data.requestData ?? []);
            //console.log("Requests data:", requestData);
        } catch (e) {
            console.error("Error in getting requests Data: ", e.response?.data?.message || e.message);
        }
    }


    async function fetchChats() {
        try {
            const result = await axios.get(`${serverUrl}/api/conversation/all`, { withCredentials: true });
            setChats(result.data.chats ?? []);
            //console.log("fetched chats: ", chats)
        } catch (e) {
            console.error("Error getting chats", e.response?.data?.message);
        }
    }


    async function fetchRequestCount() {
        try {
            const result = await axios.get(`${serverUrl}/api/connection/request-count`, { withCredentials: true });
            setRequestCount(result.data.requestcount ?? 0);
            //console.log("fetched chats: ", requestCount);
        } catch (e) {
            console.error("Error getting requestcount", e.response?.data?.message);
        }
    }



    const fetchUnreadCount = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/messages/unread-count`, { withCredentials: true });
            //console.log("unread count response:", result.data);
            setUnreadCount(result.data.unreadCount ?? 0);
            //console.log("fetched unread count: ", unreadCount);
        } catch (e) {
            console.error("Error getting unread count", e.response?.data?.message || e.message);
        }
    }




    const fetchInvites = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/invite/getallinvites`, { withCredentials: true });
            setInvites(result.data.invites ?? []);
        } catch (e) {
            console.error("Error in fetching invites", e.response?.data?.message || e.message);
        }
    }


    const fetchNotificationCount = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/notification/notification-count`, { withCredentials: true });
            setNotificationCount(result.data?.count ?? 0);

        } catch (e) {
            console.error("Error in fetching invites", e.response?.data?.message || e.message);
        }
    }




    const fetchNotifications = async () => {
        try {
            // setLoading(true);
            const result = await axios.get(
                `${serverUrl}/api/notification/allnotifications`,
                { withCredentials: true }
            );
            // Extract the target array safely
            const incomingNotifs = result.data?.notifications ?? result.data;

            // FORCE check: Only set state if it is a valid array, otherwise default to empty array
            if (Array.isArray(incomingNotifs)) {
                setNotifications(incomingNotifs);
            } else {
                console.warn("Backend did not return an array for notifications, resetting to []:", result.data);
                setNotifications([]);
            }
            // setNotifications(result.data?.notifications ?? []);
            // console.log("notifications from backend", result.data?.notifications);
        } catch (e) {
            console.error("Error fetching notifications:", e.response?.data?.message || e.message);
        }
        //   } finally {
        //     setLoading(false);
        //   }
    }





    //listen for new invite , connection-request
    useEffect(() => {
        if (!socket) return;

        socket.on('new-invite', ({ invite, notification }) => {
            if (invite) {
                setInvites(prev => [invite, ...prev]); // add to invites list
            }
            if (notification) {
                setNotificationCount(prev => prev + 1); // bump notification bell
                setNotifications(prev => [notification, ...prev])
            }
            console.log("socket new-invite")
        });


        socket.on('invite-accepted', ({ notification, conversation }) => {
            if (notification) {
                setNotificationCount(prev => prev + 1); // bump notification bell
                setNotifications(prev => [notification, ...prev])
            }
            if (conversation) {
                setChats(prev => [conversation, ...prev]);
            }
        });

        socket.on('invite-rejected', ({ notification }) => {
            if (notification) {
                setNotificationCount(prev => prev + 1);
                setNotifications(prev => [notification, ...prev])
                console.log("socket invite-rejected")
            }
        });


        socket.on('new-connection-request', ({ connection, notification }) => {
            console.log("Socket received: new connection request");
            if (connection) {
                setRequestCount(prev => prev + 1);
                setRequestData(prev => [connection, ...prev]);
            }

            if (notification) {
                setNotifications(prev => [notification, ...prev]);
                setNotificationCount(prev => prev + 1);
            }


        });

        socket.on('connection-accepted', ({ notification, conversation }) => {
            console.log("Socket Event: A sent Connection request was accepted!");

            if (notification) {
                setNotifications(prev => [notification, ...prev]);
                setNotificationCount(prev => prev + 1);
            }
            if (conversation) {
                setChats(prev => [conversation, ...prev]);
            }
        });

        socket.on('connection-rejected', ({ notification }) => {
            console.log("Socket Event: A connection request was declined.");
            if (notification) {
                setNotifications(prev => [notification, ...prev]);
                setNotificationCount(prev => prev + 1);
            }
        });

    //    useEffect(() => {
    // if (!socket) return;

    socket.on('new-message-notification', ({ conversationId, message }) => {
        
        // 1. Only increment badges if the user is NOT actively looking at this conversation
        if (selectedConversation?._id?.toString() !== conversationId?.toString()) {
            
            // 2. Bump the main global navbar count
            setUnreadCount(prev => prev + 1);

            // 3. 🌟 Increment the unreadCount for the specific conversation inside the chats array
            setChats(prevChats => prevChats.map(chat => {
                if (chat._id?.toString() === conversationId?.toString()) {
                    return {
                        ...chat,
                        lastMessage: message.text || message, // Update the last message preview snippet
                        unreadCount: (chat.unreadCount || 0) + 1 // Increment individual badge count
                    };
                }
                return chat;
            }));
        }
    });

        return () => {
            socket.off('new-invite');
            socket.off('invite-accepted');
            socket.off('invite-rejected');
            socket.off('new-connection-request');
            socket.off('connection-accepted');
            socket.off('connection-rejected');
            socket.off('new-message-notification');

        }
    }, [socket, selectedConversation]);



    useEffect(() => {
        // reset first
        // Issue resolved : Stale chat window after login with another account (without refresh)...i see previous Logged-in chat window
        setSelectedConversation(null);
        setChats([]);
        setRequestData([]);
        setInvites([]);
        setNotifications([]);

        // then fetch fresh data for the new user
        if (userData?._id) {
            fetchChats();
            fetchRequestData();
            fetchRequestCount();
            fetchUnreadCount();
            if (!isRecruiter) {
                fetchInvites();
            }
            fetchNotificationCount();
            fetchNotifications();
        }


    }, [userData?._id]);




    return (

        <ChatDataContext.Provider value={{
            chats,
            setChats,
            requestCount,
            setRequestCount,
            requestData,
            setRequestData,
            fetchChats,
            fetchRequestData,
            selectedConversation,
            setSelectedConversation,
            desktopChatModal,
            setDesktopChatModal,
            activeDesktopTab,
            setActiveDesktopTab,
            socket,
            setSocket,
            onlineUsers,
            setOnlineUsers,
            unreadCount,
            setUnreadCount,
            fetchUnreadCount,
            invites,
            setInvites,
            fetchInvites,
            notificationCount,
            setNotificationCount,
            fetchNotificationCount,
            activeSection,
            setActiveSection,
            fetchNotifications,
            notifications,
            setNotifications,
            refreshMetadata: () => {
                fetchChats();
                fetchRequestCount();
                fetchRequestData();
                fetchUnreadCount();
                fetchInvites();
                fetchNotificationCount();
                fetchNotifications();
            }
        }}>
            {children}
        </ChatDataContext.Provider>


    )
}

export default ChatContext
