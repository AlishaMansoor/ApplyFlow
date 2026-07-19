import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from "react-router-dom";
import { FaRectangleList } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { CgFeed } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { TbFileCv } from "react-icons/tb";
import { BsBriefcaseFill } from "react-icons/bs";
import { MdPostAdd } from "react-icons/md";
import EditProfile from '../ui/EditProfile.jsx';
import LogoutModal from '../ui/LogoutModal.jsx';
import UploadResume from '../ui/UploadResume.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';//for accessing userData and setUserData
import CreateJobModal from '../jobs/CreateJobModal.jsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const { userData, loading, setUserData } = React.useContext(UserDataContext);
    const isRecruiter = userData?.userType === 'recruiter';
    const [logoutModal, setLogoutModal] = React.useState(false);
    const [resumeOpen, setResumeOpen] = React.useState(false);
    const [createJobOpen, setCreateJobOpen] = React.useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/home';

    // just opens the modal — actual logout happens inside modal
    const handleLogout = () => {
        setLogoutModal(true);
    }
    const [theme, setTheme] = React.useState("light");
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    if (!sidebarOpen && window.innerWidth >= 1024) return null;
    
    
    return (

        <div className='w-full'>

            {logoutModal && (<LogoutModal setLogoutModal={setLogoutModal} />)}
            {resumeOpen && (<UploadResume setResumeOpen={setResumeOpen} />)}
            {createJobOpen && (<CreateJobModal setCreateJobOpen={setCreateJobOpen} />)}
            
            {/* main div of sidebar */}

            <motion.div
                initial={isHomePage?{ opacity: 0, x: -240 }:{opacity:1, x:0}}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 1, x: -240 }}
                transition={isHomePage?{ duration: 0.3, ease: 'easeOut' }:{duration:0}}
                className="z-40 h-[calc(100vh-80px)] bg-emerald-100 border-r-2 border-gray-300 w-[240px] flex flex-col px-4 py-6 items-center fixed top-[80px] left-0 overflow-y-auto">

                {/* Profile section — same for both,candidate and recruiter */}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex flex-col  items-center justify-center mt-5 gap-2 cursor-pointer" >
                        {userData?.profileImage ? (
                            <img
                                src={userData.profileImage}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center ">
                                {userData?.firstName ? (
                                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-gray-300 text-emerald-700">{userData.firstName.charAt(0).toUpperCase()}</span>
                                ) : (
                                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                        )}

                        <div className=" text-sm font-medium text-gray-500 ">{userData?.firstName?.toUpperCase() || "User"}</div>
                        {userData?.headline && <p className="text-sm text-gray-500">{userData.headline}</p>}
                        {userData?.organization?.organizationName && <p className="text-sm text-gray-500">{userData.organization.organizationName}</p>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isRecruiter ? 'bg-blue-100 text-blue-600' : 'bg-emerald-200 text-emerald-700'}`}>
                            {isRecruiter ? 'Recruiter' : 'Candidate'}
                        </span>
                    </div>
                )}



                <hr className="w-full border-gray-400  mt-5 mb-5"></hr>

                {/* ── Common links ── */}
                {/* <NavLink to='/dashboard'
                    className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                    <CgFeed className="text-lg" /><span className='text-sm'>Dashboard Overview</span>
                </NavLink> */}

                <NavLink to='/home'
                    className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md hover:bg-gray-200 cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                    <IoHome className="text-lg" /><span className='text-sm'>Home</span>
                </NavLink>




                {!isRecruiter && (
                    <>
                        <NavLink to='/myapplications'
                            className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                            <FaRectangleList className="text-lg" /><span className='text-sm'>My Applications</span>
                        </NavLink>


                        <NavLink to='/savedapplications'
                            className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                            <BsBookmarkHeartFill className="text-lg" /><span className='text-sm'>Saved Applications</span>
                        </NavLink>

                        <div onClick={() => setResumeOpen(true)}
                            className=" w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:bg-gray-200 hover:text-emerald-900 hover:rounded-md cursor-pointer">
                            <TbFileCv className="text-xl" /><span className='text-sm'>Resume</span>
                        </div>

                    </>
                )}
                {/* ── Recruiter only links ── */}

                {isRecruiter && (
                    <>
                        

                        <div onClick={() => setCreateJobOpen(true)}
                            className=" w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:bg-gray-200 hover:text-emerald-900 hover:rounded-md cursor-pointer">
                            <MdPostAdd className="text-lg" /><span className='text-sm'>Post a Job</span>
                        </div>
                    </>
                )}
                {/* ── Common bottom links ── */}
                <NavLink to={`/profile/${userData.userName}`} className={({ isActive }) => `w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                    <FaUserCircle className="text-lg" />
                    <span className='text-sm'>Profile</span>
                </NavLink>





                <div className="w-full px-3 py-1.5 flex items-center gap-2 mb-1 hover:bg-gray-200 hover:text-emerald-900 hover:rounded-md cursor-pointer">
                    <IoMoon className='text-lg' onClick={toggleTheme} />
                    <div className="text-sm">Dark Mode</div>
                </div>
                <div
                    onClick={() => handleLogout()}
                    className="w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:bg-gray-200 hover:text-emerald-900 hover:rounded-md cursor-pointer">
                    <IoLogOut className='text-lg' />
                    <div className="text-sm">Logout</div>
                </div>
                <NavLink to='/settings'
                    className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md hover:bg-gray-200 cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
                    <IoSettings className="text-lg" /><span className='text-sm'>Settings</span>
                </NavLink>
            </motion.div>
        </div >
    )
}

export default Sidebar
