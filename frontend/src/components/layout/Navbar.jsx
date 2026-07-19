import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import { FaRectangleList } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { BsList } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCheck } from 'react-icons/fa';
import { FaBars } from "react-icons/fa";
import { RiInboxArchiveLine } from "react-icons/ri";
import { PiChatsFill } from "react-icons/pi";
import LogoutModal from '../ui/LogoutModal.jsx'
import EditProfile from '../ui/EditProfile.jsx'
import SearchPreviewDropDown from '../ui/SearchPreviewDropDown.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';
import { AuthDataContext } from '../../context/AuthContext.jsx'
import { SearchQueryContext } from '../../context/SearchContext.jsx';
import { ChatDataContext } from '../../context/ChatContext.jsx';
import axios from 'axios';
import ConversationList from '../ui/ConversationList.jsx';
import ChatWindow from '../ui/ChatWindow.jsx';
import NotificationModal from '../ui/NotificationModal.jsx'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const { searchQuery, setSearchQuery, searchScope, setSearchScope, clearSearch } = React.useContext(SearchQueryContext);
    const [searchScopeDropDown, setSearchScopeDropDown] = React.useState(false);
    const { userData } = React.useContext(UserDataContext);
    const { serverUrl } = React.useContext(AuthDataContext);
    const {
        desktopChatModal,
        setDesktopChatModal,
        activeDesktopTab,
        setActiveDesktopTab,
        selectedConversation,
        setSelectedConversation,
        unreadCount,
        setUnreadCount,
        requestCount,
        notificationCount } = React.useContext(ChatDataContext);
    const [profileDropdown, setProfileDropdown] = React.useState(false);
    const [logoutModal, setLogoutModal] = React.useState(false);
    const [editProfileOpen, setEditProfileOpen] = React.useState(false);
    const isRecruiter = userData?.userType === 'recruiter';
    const dropdownRef = React.useRef(null);
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchPreviewDropDown, setSearchPreviewDropDown] = React.useState(false);
    const [chatModal, setChatModal] = React.useState(false);
    const [notificationModal, setNotificationModal] = React.useState(false);

    // Close dropdown if user clicks outside of it
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    React.useEffect(() => {

        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchPreviewDropDown(false);
            return;
        }
        if (searchScope === 'jobs') {

            setSearchResults([]);
            setSearchPreviewDropDown(false);
            return;

        }
        if (searchScope === 'people') {
            //debounce function to avoid too many api calls while typing
            const timer = setTimeout(async () => {
                try {
                    setSearchLoading(true);
                    const result = await axios.get(`${serverUrl}/api/user/search?q=${searchQuery}`, { withCredentials: true });
                    setSearchResults(result.data.users ?? []);
                    setSearchPreviewDropDown(true);
                } catch (e) {
                    console.log("Error in searching", e)
                } finally {
                    setSearchLoading(false);
                }
            }, 300); //debounce

            return () => clearTimeout(timer);
        }
    }, [searchQuery, searchScope]);



    return (
        <div>
            {editProfileOpen && (<EditProfile setEditProfileOpen={setEditProfileOpen} />)}
            {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
            {notificationModal && <NotificationModal setNotificationModal={setNotificationModal} />}

            {desktopChatModal && (
                <div className="hidden lg:flex fixed bottom-5 right-6 w-96 h-[470px] bg-gray-50 border border-gray-200  rounded-xl z-50 overflow-hidden flex-col shadow-[8px_8px_16px_rgba(0,0,0,0.08)]">

                    {activeDesktopTab === 'ChatWindow' ? (
                        <ConversationList isModal={true} onClose={() => setDesktopChatModal(false)} />
                    ) : (
                        <ChatWindow conversation={selectedConversation} isModal={true} />
                    )}

                </div>
            )}

            <div className="w-full fixed h-[80px] bg-[#f2f1f1] flex items-center justify-between px-6 md:pr-10  top-0 z-40 shadow-md left-0">

                <div className="flex items-center gap-3">
                    <BsList className='lg:hidden block stroke-1 w-5 h-5 text-gray-700 cursor-pointer' onClick={() => { setSidebarOpen(!sidebarOpen) }} />
                    <LuBriefcaseBusiness className="text-emerald-600 md:w-5 md:h-5 w-6 h-6 cursor-pointer" />
                    <span className="hidden md:block font-bold text-xl text-slate-800">
                        Apply<span className="text-emerald-600">Flow</span>
                    </span>
                </div>


                <div className="w-[180px] lg:w-1/3 md:w-1/2 relative ">
                    <span className='flex  items-center '>
                        <input type="text" placeholder={`Search ${searchScope === 'jobs' ? 'jobs' : 'people'}...`} value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (searchScope === 'jobs' && location.pathname !== '/home') {
                                        navigate('/home');
                                    }
                                }
                            }}
                            className="w-full  border-2  border-gray-500 text-[16px] p-1 pr-10 rounded-full focus:outline-none focus:border-emerald-600" />
                        {/* {console.log("searchquery: ", searchQuery)} */}
                        <button type="button" className="absolute cursor-pointer right-8 text-gray-600 font-medium text-xl overflow-hidden ">
                            <IoSearchSharp className="text-emerald-600 hover:emerald-700" onClick={() => {
                                if (searchScope === 'jobs' && location.pathname !== '/home') {
                                    navigate('/home');
                                }
                            }} />

                        </button>
                        <button type="button" className="absolute inline-block right-3 text-gray-600 hover:gray-700 cursor-pointer font-medium text-xl overflow-hidden ">
                            <IoMdArrowDropdown onClick={() => setSearchScopeDropDown(!searchScopeDropDown)} />

                        </button>
                        {searchScopeDropDown && (
                            <div className="absolute z-[50] top-full right-0 bg-white shadow-lg rounded-md py-2 min-w-[130px]">
                                <button onClick={() => { setSearchScope('jobs'); setSearchScopeDropDown(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 
                                            ${searchScope === 'jobs'
                                            ? 'text-emerald-600 bg-emerald-50 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'}`}
                                >Jobs</button>
                                <button onClick={() => { setSearchScope('people'); setSearchScopeDropDown(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2
                                            ${searchScope === 'people'
                                            ? 'text-emerald-600 bg-emerald-50 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    People
                                    {searchScope === 'people' && <FaCheck className="text-xs text-emerald-600" />}
                                </button>       </div>
                        )}
                        {searchPreviewDropDown && <SearchPreviewDropDown searchResults={searchResults} searchLoading={searchLoading} onClose={() => setSearchPreviewDropDown(false)} />}
                    </span>
                </div>


                <div className="  flex items-center justify-center gap-4  text-gray-600 font-medium text-md  ">
                    <NavLink to='/home' 
                    className={({ isActive }) => `relative flex flex-col  items-center justify-center gap-1 hover:text-emerald-700 cursor-pointer ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'}`}>
                        
                            {isRecruiter ? (
                                <div className="flex flex-col items-center gap-1">
                                <div className='h-6 w-6 flex items-center justify-center'>
                                    <IoHome className="w-5 h-5  " />  
                                </div>
                                <div className="hidden lg:flex flex-col text-sm">Home</div>
                                </div>
                            ) : (
                                 <div className="flex flex-col items-center gap-1">
                                <div className='h-6 w-6 flex items-center justify-center'>
                                    <FaBriefcase className="w-5 h-5  " />  
                                </div>
                                <div className="hidden lg:flex flex-col text-sm ">Explore</div>
                                </div>
                            )}
                            

                    </NavLink>

                    {!isRecruiter && (
                        <>
                            <NavLink to="/myapplications"
                                className={({ isActive }) => `hidden lg:flex flex-col  items-center justify-center flex-grow gap-1 hover:text-emerald-700 cursor-pointer ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'}`}>
                                <div className='h-6 w-6'>
                                    <FaRectangleList className="lg:w-5 lg:h-5" />
                                </div>
                                <div className="hidden  lg:flex flex-col text-sm">Applications</div>
                            </NavLink>
                            <NavLink to="/savedapplications"
                                className={({ isActive }) => `hidden lg:flex flex-col  items-center justify-center flex-grow gap-1 hover:text-emerald-700 cursor-pointer ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'}`}>
                                <div className='h-6 w-6'>
                                    <BsBookmarkHeartFill className="lg:w-5 lg:h-5" />
                                </div>
                                <div className="hidden  lg:flex flex-col text-sm">Saved</div>
                            </NavLink>
                        </>
                    )}

                    <NavLink to='/conversations'
                        className={({ isActive }) => `lg:hidden  relative  flex flex-col  items-center justify-center flex-grow gap-1 hover:text-emerald-700 cursor-pointer ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'}`}>
                        <div className="relative  h-6 w-6">
                            <PiChatsFill className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1
                     flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="hidden  lg:flex flex-col text-sm">Chats</div>
                    </NavLink>

                    <div onClick={() => setDesktopChatModal(!desktopChatModal)}
                        className="relative hidden   lg:flex flex-col justify-center items-center gap-1 hover:text-emerald-700 cursor-pointer">
                        <div className="relative  h-6 w-6">
                            <PiChatsFill className="w-6 h-6" />

                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1
                     flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col text-sm">Chats</div>
                    </div>


                    <div onClick={() => setNotificationModal(!notificationModal)}
                        className="relative flex flex-col justify-center items-center hover:text-emerald-700 cursor-pointer">
                        <div className="relative  h-6 w-6">
                            <IoNotifications className="w-5 h-5 " />
                            {notificationCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white p-1 text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1
                     flex items-center justify-center">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </div>
                        {/* {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white p-1 text-[10px] font-semibold rounded-full w-4 h-4 
                     flex items-center justify-center">
                                {noticationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )} */}
                        {isRecruiter ?
                            <div className="hidden lg:flex flex-col text-sm">
                                Notifications
                            </div> :
                            <div className="hidden lg:flex flex-col text-sm">
                                Notifi..
                            </div>}

                    </div>


                    <div ref={dropdownRef} className=" flex flex-col  items-center justify-center gap-1 hover:text-emerald-700 cursor-pointer">
                        <div className='h-6 w-6'>
                            {userData?.profileImage ? (
                                <img
                                    src={userData.profileImage}
                                    alt="Profile"
                                    onClick={() => setProfileDropdown(!profileDropdown)}
                                    className="w-6 h-6 rounded-full object-cover border-2 border-emerald-500"
                                />
                            ) : (
                                <FaUserCircle
                                    onClick={() => setProfileDropdown(!profileDropdown)}
                                    className="w-5 h-5 md:w-5 md:h-5 hover:text-emerald-700"
                                />
                            )}
                        </div>
                        <div className="hidden lg:flex text-sm flex-col hover:text-emerald-700"
                            onClick={() => setProfileDropdown(!profileDropdown)}>
                            Profile
                        </div>

                        {/* Dropdown menu */}
                        {profileDropdown && (
                            <div
                                className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-100 w-48 z-50 overflow-hidden">

                                {/* User info at top */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {userData?.firstName} {userData?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
                                </div>

                                {/* Menu items */}
                                <div className="flex flex-col py-1">
                                    <button
                                        onClick={() => { navigate(`/profile/${userData?.userName}`); setProfileDropdown(false); }}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 text-left"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => { setLogoutModal(true); setProfileDropdown(false); }}
                                        className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Navbar
