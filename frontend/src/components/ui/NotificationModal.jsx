import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext.jsx';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { ChatDataContext } from '../../context/ChatContext.jsx';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BsBriefcase } from 'react-icons/bs';
import { IoPeopleOutline } from 'react-icons/io5';
import { FiCheckCircle } from 'react-icons/fi';

function NotificationModal({ setNotificationModal }) {
  // const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { serverUrl } = React.useContext(AuthDataContext);
  const { userData } = React.useContext(UserDataContext);
  const navigate = useNavigate();
  const { desktopChatModal,
    setDesktopChatModal,
    activeDesktopTab,
    setActiveDesktopTab,
    activeSection,
    setActiveSection,
    socket,
    setSocket,
    notifications,
    setNotifications,
    fetchNotifications,
  notificationCount,
setNotificationCount } = React.useContext(ChatDataContext);






  const markAsRead = async (notificationId) => {
    try {
      //Find the notification to check its current status before making the API call
      const targetedNotif = notifications.find(n => n._id === notificationId);
      
      // Optimization: Only run update logic if it's currently unread
      if (targetedNotif && !targetedNotif.isRead) {
      await axios.put(
        `${serverUrl}/api/notification/markread/${notificationId}`,
        {},
        { withCredentials: true }
      );
      console.log("macerena");
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setNotificationCount(prev => Math.max(0, prev-1));
        // prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      }
    
    } catch (e) {
      console.error("Error marking as read:", e.message);
    }
  }



  const handleNotificationClick = async (notif) => {
    await markAsRead(notif._id);
    setNotificationCount(prev => Math.max(0, prev-1));
    setNotificationModal(false);

    const isMobile = window.innerWidth < 1024;

    if (notif.type === 'invite') {
      if (isMobile) {
        navigate('/conversations', { state: { targetSection: 'invites' } });
      } else {
        setActiveSection('invites');
        setDesktopChatModal(true);
      }
    } else if (notif.type === 'connection-request') {
      if (isMobile) {
        navigate('/conversations', { state: { targetSection: 'requests' } });
      } else {
        setActiveSection('requests');
        setDesktopChatModal(true);
      }
    } else if (notif.type === 'connection-request-update' || notif.type === 'invite-update') {
      // Check if the backend attached a conversation context or use the sender's id to match
      if (isMobile) {
        // Redirect to messages page and pass state to auto-select this conversation
        navigate('/conversations', { state: { autoSelectUserId: notif.senderId?._id || notif.senderId } });
      } else {
        // On desktop, shift them straight to the active conversation tab
        setActiveSection('chats'); 
        setDesktopChatModal(true);
        
      } 
    }else if (notif.type === 'application-update') {
      navigate('/myapplications');
    }
  }



  // icon per notification type
  const getTypeIcon = (type) => {
    if (type === 'invite') return <BsBriefcase className="w-3.5 h-3.5 text-blue-500" />;
    if (type === 'connection-request') return <IoPeopleOutline className="w-3.5 h-3.5 text-emerald-500" />;
    if (type === 'application-update') return <FiCheckCircle className="w-3.5 h-3.5 text-purple-500" />;
    return null;
  }

  const getTypeBadge = (type) => {
    if (type === 'invite') return 'bg-blue-50 text-blue-600';
    if (type === 'connection-request') return 'bg-emerald-50 text-emerald-600';
    if (type === 'application-update') return 'bg-purple-50 text-purple-600';
    return 'bg-gray-50 text-gray-600';
  }

  const getTypeLabel = (type) => {
    if (type === 'invite') return 'Job Invite';
    if (type === 'connection-request') return 'Connection';
    if (type === 'application-update') return 'Application';
    return 'Notification';
  }

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <>
      {/* overlay — click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setNotificationModal(false)}
      />

      {/* modal */}
      <div className="fixed top-[70px] right-4 w-[90%] max-w-[360px] 
                      bg-white rounded-2xl shadow-2xl border border-gray-100 
                      z-50 overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <IoNotificationsOutline className="w-5 h-5 text-gray-700" />
            <h4 className="font-semibold text-gray-800 text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold 
                               px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {/* mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={async () => {
                await Promise.all(
                  notifications
                    .filter(n => !n.isRead)
                    .map(n => markAsRead(n._id))
                );
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* body */}
        <div className="max-h-[480px] overflow-y-auto">

          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
          )}

          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <IoNotificationsOutline className="w-10 h-10 text-gray-200" />
              <p className="text-sm text-gray-400">No notifications yet</p>
            </div>
          )}

          {!loading && notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex  items-start gap-1 px-1 py-2 cursor-pointer
                         border-b border-gray-50 hover:bg-gray-50 transition-colors
                         ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
            >
              <div className=" w-full  flex items-center justify-between gap-2 p-2 border-b hover:bg-gray-50">
                {/* avatar */}
                <div className="relative flex-none  w-10 h-10 rounded-full">
                  {notif.senderId?.profileImage ? (
                    <img
                      src={notif.senderId.profileImage}
                      className="w-10 h-10 rounded-full object-cover"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotificationModal(false);
                        navigate(`/profile/${notif.senderId.userName}`);
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 
                                 flex items-center justify-center 
                                 text-sm font-semibold text-emerald-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotificationModal(false);
                        navigate(`/profile/${notif.senderId.userName}`);
                      }}
                    >
                      {notif.senderId?.firstName?.charAt(0)}
                    </div>
                  )}
                  {/* type icon badge on avatar */}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white 
                               rounded-full p-0.5 shadow-sm">
                    {getTypeIcon(notif.type)}
                  </div>
                </div>

                {/* content */}
                <div className="flex-1  min-w-0  flex flex-col items-start " onClick={() => { markAsRead(notif._id) }}>
                  <div className="flex items-center gap-1.5 mb-0.5 ">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 
                                   rounded-full ${getTypeBadge(notif.type)}`}>
                      {getTypeLabel(notif.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug">
                    {/* <span className="font-medium">
                    {notif.senderId?.firstName} {notif.senderId?.lastName}
                  </span> */}

                    {/* remove sender name from message to avoid duplication */}
                    {notif.message}

                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatTime(notif.createdAt)}
                  </p>
                </div>

                {/* unread dot */}
                <div className="flex-none w-4 flex items-center justify-center">
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default NotificationModal