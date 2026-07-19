// Profile.jsx
import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext.jsx'
import { AuthDataContext } from '../context/AuthContext.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import EditProfile from '../components/ui/EditProfile.jsx'
import { AnimatePresence, motion } from 'framer-motion'
import { FaUserCircle } from 'react-icons/fa'
import { FaUserEdit } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'
import { TbFileCv } from 'react-icons/tb'
import { MdWork } from 'react-icons/md'
import { IoSchool } from 'react-icons/io5'
import { BsBriefcaseFill } from "react-icons/bs";
import UploadResume from '../components/ui/UploadResume.jsx'
import axios from 'axios';
import JobCardBody from '../components/jobs/JobCardBody.jsx'
import { ChatDataContext } from '../context/ChatContext.jsx'
import InviteModal from '../components/ui/InviteModal.jsx'

const Profile = () => {

  const { serverUrl } = React.useContext(AuthDataContext);
  const { userData } = React.useContext(UserDataContext);
  const { chats, setSelectedConversation, setDesktopChatModal, setActiveDesktopTab } = React.useContext(ChatDataContext);
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024)
  const [editProfileOpen, setEditProfileOpen] = React.useState(false)
  const [resumeOpen, setResumeOpen] = React.useState(false);
  const [totalJobData, setTotalJobData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useParams();
  const fromJobDetailRecruiter = location.state?.fromJobDetailRecruiter;
  const applicationId = location.state?.applicationId;
  const [profileData, setProfileData] = React.useState(null);
  const [requestSent, setRequestSent] = React.useState(false);
  const isOwnProfile = !userName || userName === userData?.userName;
  const [requestStatus, setRequestStatus] = React.useState("");
  const [userNotFound, setUserNotFound] = React.useState(false);
  const [inviteModal, setInviteModal] = React.useState(false);


  // { isOwnProfile && <p>Edit Profile button Visible.</p> }
  // { !isOwnProfile && fromJobDetailRecruiter && <p>Accept/Reject buttons Visible.</p> }
  // { !isOwnProfile && !fromJobDetailRecruiter && <p>no buttons, Only profile page Visible.</p> }



  React.useEffect(() => {
    if (isOwnProfile) {
      setProfileData(userData); // use context — no API call
      return;
    }
    // fetch the other user's data
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getprofile/${userName}`,
          { withCredentials: true }
        );
        setProfileData(result.data.user);
      } catch (e) {
        console.error("Error in getting requested profile.", e.response?.data?.message || e.message);
        setProfileData(null);
        setUserNotFound(false);
      }
    }
    fetchUser();

  }, [userName, userData?.userName]);
  console.log(profileData);



  React.useEffect(() => {
    if (!profileData) return; // wait until profileData is set
    if (profileData.userType !== 'recruiter') return;
    async function fetchPostedJobs() {
      try {
        const result = await axios.get(`${serverUrl}/api/job/gettotaljobs/${profileData.userName}`, { withCredentials: true });
        setTotalJobData(result.data.totalJobs ?? []);
        console.log("Posted jobs, Profile page:", result.data.totalJobs);
      } catch (error) {
        console.error("Error fetching posted jobs:", error.response?.data);

      }
    }
    fetchPostedJobs();
  }, [profileData]);
  console.log("requestStatus:", requestStatus);
  console.log("chats length:", chats.length);

  const fetchRequestStatus = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/connection/requeststatus/${profileData._id}`, { withCredentials: true });
      setRequestStatus(result.data.status || 'none');
      console.log("request status fetched: ", status);
    } catch (e) {
      console.error("Error fetching status of request sent.", e.response?.data?.message);
    }
  }


  React.useEffect(() => {
    if (profileData?._id) {
      fetchRequestStatus();
    }
  }, [profileData?._id]);

  const setApplicationStatus = async (value) => {
    if (value == "Accepted") setAcceptLoading(true);
    if (value == "Rejected") setRejectLoading(true);

    setError(null);
    setSuccess(null);
    try {
      const result = await axios.put(`${serverUrl}/api/application/${applicationId}`, { status: value }, { withCredentials: true });
      console.log("Application status updated successfully:", result.data);
      setSuccess("Application status updated to " + value);
    } catch (e) {
      setError((e.response?.data?.message || e.message));
      console.error("Error updating application status:", e);
    }
    finally {
      setAcceptLoading(false);
      setRejectLoading(false);
    }
  }




  const sendRequest = async () => {
    try {
      // console.log("sendRequest route hit!");
      const receiverId = profileData?._id;
      const result = await axios.post(`${serverUrl}/api/connection/${receiverId}`, { status: 'pending' }, { withCredentials: true });
      // console.log("frontend api succeed.")
      setRequestSent(true);
    } catch (e) {
      setRequestSent(false);
      console.error("frontend Error: ", e.response?.data?.message)
    }

  }




  const handleMessageButtonClick = async () => {
    console.log("=== DEBUG ===");
    console.log("requestStatus:", requestStatus);
    console.log("chats count:", chats.length);
    console.log("profileData._id:", profileData?._id);
    chats.forEach((chat, i) => {
      console.log(`chat ${i} participants:`, chat.participants.map(p => ({
        id: p._id,
        name: p.firstName
      })));
    });

    if (requestStatus === 'accepted') {
      let matchedConversation = chats.find(chat =>
        chat.participants.some(participant => participant._id?.toString() === profileData._id?.toString())
      );

      if (!matchedConversation) {
        const result = await axios.get(
          `${serverUrl}/api/conversation/all`,
          { withCredentials: true }
        );
        const freshChats = result.data.chats ?? [];
        matchedConversation = freshChats.find(chat =>
          chat.participants.some(
            p => p._id?.toString() === profileData?._id?.toString()
          )
        );
        setChats(freshChats); // update context too
      }

      if (matchedConversation) {
        setSelectedConversation(matchedConversation);
        setActiveDesktopTab('MessageWindow');

        if (window.innerWidth >= 1024) {
          // large screen → open floating modal
          setDesktopChatModal(true);
        } else {
          // small/medium → navigate to chat page
          navigate('/conversations');
        }
      }

    } else if (requestStatus === 'none') {
      try {
        await sendRequest();
        setRequestStatus('pending');
      } catch (e) {
        console.error("Failed to submit connection proposal", e);
      }

    }
  };

  if (userNotFound) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">User not found</p>
    </div>
  );

  return (
    <div className="bg-slate-50 p-2 w-full lg:w-[calc(100%-240px)] min-h-screen flex flex-col justify-start items-start lg:ml-[240px]">

      {resumeOpen && (<UploadResume setResumeOpen={setResumeOpen} />)}
      {inviteModal && (<InviteModal setInviteModal={setInviteModal} receiverId={profileData._id} />)}

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar — small/medium */}
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar — large */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* EditProfile modal */}
      {editProfileOpen && (
        <EditProfile setEditProfileOpen={setEditProfileOpen} />
      )}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=" bg-slate-50 w-full pb-28 mt-[80px] lg:ml-[50px] p-6 max-w-full md:max-w-2xl lg:max-w-3xl overflow-y-auto mb-10"
      >
        {!isOwnProfile && fromJobDetailRecruiter && (
          <div className="fixed w-full bottom-4 right-0 p-4 flex justify-end gap-2 z-50">
            <button
              onClick={() => setApplicationStatus("Accepted")}
              disabled={acceptLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-base font-medium py-2 px-4 rounded-lg">{acceptLoading ? "Loading..." : "Accept"}</button>
            <button
              onClick={() => setApplicationStatus("Rejected")}
              disabled={rejectLoading}
              className="bg-red-500 hover:bg-red-600 text-white text-base font-medium py-2 px-4 rounded-lg">{rejectLoading ? "Loading..." : "Reject"}</button>
          </div>
        )}
        <div className='flex justify-between items-start mb-1'>

          <h2 className='mb-2 text-xl font-semibold text-gray-700  mt-2 ml-2'>Profile</h2>


        </div>
        <hr className=' mb-5'></hr>
        {/* Header card */}
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.1 }}
          className="bg-slate-50 w-full mt-3 mb-3 rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">

          {/* Avatar + name + edit button */}
          <div className="flex  w-full items-start justify-between">
            <div className="flex  pr-2 items-center gap-4">
              {profileData?.profileImage ? (
                <img
                  src={profileData.profileImage}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {profileData?.firstName ? (
                    <span className="text-2xl font-bold text-emerald-700">
                      {profileData.firstName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <FaUserCircle className="w-20 h-20 text-gray-400" />
                  )}
                </div>
              )}

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                <p className="text-gray-500 text-sm font-medium">@{profileData?.userName}</p>
                {profileData?.headline && (
                  <p className="text-gray-600 text-sm mt-1">{profileData.headline}</p>
                )}
                {profileData?.location && (
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <IoLocationOutline className='w-4 h-4 text-gray-500 ' />
                    {profileData.location}
                  </p>
                )}
              </div>
            </div>

            {/* Edit button */}
            {isOwnProfile && (
              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center gap-2 bg-emerald-600  
                         text-white px-3 py-1.5 rounded-lg text-sm font-medium
                         hover:bg-emerald-700 transition-colors"
              >
                <FaUserEdit className='text-white text-sm ' />
                <span className="hidden min-[500px]:block">Edit Profile</span>
                <span className="block min-[500px]:hidden">Edit</span>

              </button>
            )}
            {!isOwnProfile && userData.userType === 'candidate' && (
              <button
                onClick={handleMessageButtonClick}
                disabled={requestStatus === 'pending'}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${requestStatus === 'pending' ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-300' :
                  requestStatus === 'accepted' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                    'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
              >
                {requestStatus === 'pending' && 'Pending'}
                {requestStatus === 'accepted' && 'Message'}
                {requestStatus === 'none' && '+Request'}
              </button>
            )}
            {!isOwnProfile && userData?.userType === 'recruiter' && profileData?.userType === 'candidate' && (
              <button
                onClick={() => setInviteModal(true)}
                className="bg-blue-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600">
                Invite to Apply
              </button>
            )}


          </div>

          {/* Resume row */}
          {profileData?.userType === 'candidate' && isOwnProfile && (
            <div className="flex items-center  justify-between border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1.5 text-gray-600">
                <TbFileCv className="w-6 h-6 text-xl text-emerald-600" />
                <span className="text-sm font-medium">Resume</span>
              </div>
              {profileData?.resume ? (
                <div className="flex gap-2">

                  <a href={profileData.resume}
                    target="_blank"
                    className="text-sm font-medium text-emerald-600 border-2 border-emerald-400 
                             px-3 py-1 rounded-lg hover:bg-emerald-50"
                  >
                    View Resume
                  </a>

                </div>
              ) : (
                <button onClick={() => setResumeOpen(true)} className="text-sm text-white bg-emerald-600 
                                 px-3 py-1 rounded-lg hover:bg-emerald-700">
                  Upload Resume
                </button>
              )}
            </div>
          )}
          {/* If recruiter, show no. of posted jobs */}
          {profileData?.userType === 'recruiter' && (
            <div className="flex items-center bg-gay-50 justify-between border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1.5 text-gray-600">
                <BsBriefcaseFill className="w-6 h-6 text-xl mr-2 text-emerald-600" />
                <span className="text-sm font-medium">Total Posted Jobs : {totalJobData.length}</span>
              </div>

            </div>

          )}

        </motion.div>
        {profileData?.userType === 'recruiter' && (
          <motion.div

            transition={{ duration: 0.1 }}
            className="bg-slate-50 w-full mt-3 mb-3 rounded-2xl p-4 flex flex-col gap-4">
            <h1 className="text-xl text-gray-700 font-semibold pl-2">Jobs:</h1>
            <JobCardBody filteredJobs={totalJobData} showHeader={false} />
          </motion.div>
        )}

        {/* Skills */}
        {profileData?.skills?.length > 0 && (
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.1 }}
            className="bg-slate-50 rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
            <h2 className="font-semibold text-gray-800 mb-3">Skills</h2>
            <div className="flex border-t border-gray-200 pt-3 flex-wrap gap-2">
              {profileData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-emerald-50 text-emerald-700 text-sm 
                             px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experience */}
        {profileData?.experience?.length > 0 && (
          <motion.div whileHover={{ y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
            className=" bg-slate-50 rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MdWork className="text-emerald-600" />
              Experience
            </h2>
            <div className="flex flex-col border-t border-gray-200 pt-3 gap-4">
              {profileData.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-emerald-200 pl-4">
                  <h3 className="font-medium text-gray-800">{exp.title}</h3>
                  <p className="text-emerald-600 text-sm">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-500 text-sm mt-1">{exp.description}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education */}
        {profileData?.education?.length > 0 && (
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-slate-50 rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <IoSchool className="text-emerald-600" />
              Education
            </h2>
            <div className="flex flex-col border-t border-gray-200 pt-4 gap-4">
              {profileData.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-emerald-200 pl-4">
                  <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                  <p className="text-emerald-600 text-sm">{edu.college}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-gray-500 text-sm">{edu.fieldOfStudy}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {edu.startYear} - {edu.endYear || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {!isOwnProfile && fromJobDetailRecruiter && (
          <div className=" p-2 mt-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        )}

      </motion.div>

    </div >


  )
}

export default Profile