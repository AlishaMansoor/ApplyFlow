import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { IoLocation } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';
import { LuBriefcase } from 'react-icons/lu';
import { IoArrowBack } from 'react-icons/io5';
import { FaFilePdf } from "react-icons/fa6";
import { FaFile } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { formatDate, formatSalary } from '../utils/helperfunc.js';

import { UserDataContext } from '../context/UserContext.jsx';
import { AuthDataContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import DeleteJobModal from '../components/jobs/DeleteJobModal.jsx';
import UpdateModal from '../components/jobs/UpdateJobModal.jsx'

function JobDetailRecruiter() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [applicantsView, setApplicantsView] = React.useState(false);
  const [updateJobModal, setUpdateJobModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [applicants, setApplicants] = React.useState([]);
  const { serverUrl } = React.useContext(AuthDataContext);
  const { userData } = React.useContext(UserDataContext);
  const isRecruiter = userData?.userType === 'recruiter';
  const [job, setJob] = React.useState(location.state?.job || null);
  const { id } = useParams();
  console.log(job);
  //fetching job via api if not provided through state (eg. when user directly visits the url instead of coming from job list)

  React.useEffect(() => {
    if (!job) {
      const fetchJob = async () => {
        try {
          const result = await axios.get(`${serverUrl}/api/job/getjob/${id}`, { withCredentials: true });
          setJob(result.data.job);
          console.log("job fetched successfully for JobDetailRecruiter via api", result.data.job);
        } catch (e) {
          console.error("Error fetching job details for JobDetailRecruiter:", e);
          toast.error("Failed to fetch job details. Please try again.");
          navigate('/'); // Navigate back to home on error}
        }
      }
      fetchJob();
    }
  }, [job]);



  const getApplicants = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/application/${job._id}`, { withCredentials: true })
      setApplicants(result.data.applicants);
      console.log("Applicants fetched successfully for job", result.data.applicants);
    } catch (e) {
      console.log("Error fetching applicants for this job:", e);
      console.error("Failed to fetch applicants. Please try again.");
    }
  }

  const toProfilePage = (userName, applicationId) => {
    try {
      console.log("Navigating to applicant profile page with userName:", userName, "and applicationId:", applicationId);
      navigate(`/profile/${userName}`, { state: { fromJobDetailRecruiter: true, applicationId: applicationId } });//for accept/reject application
    } catch (e) {
      console.error("Error navigating to applicant profile:", e);
    }
  }
  return (
    <>
      {deleteModal && <DeleteJobModal setDeleteModal={setDeleteModal} jobId={job._id} />}
      {updateJobModal && <UpdateModal setUpdateJobModal={setUpdateJobModal} jobId={job._id} job={job} setJob={setJob} />}

      <div className="w-full bg-slate-50 lg:w-[calc(100%-240px)] lg:ml-[240px]  min-h-screen pt-[80px] flex flex-col items-start justify-start gap-4 ">
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Mobile sidebar */}
        <div className="lg:hidden ">
          <AnimatePresence>
            {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          </AnimatePresence>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
        </div>



        {/* main content  */}
        <div className="w-full bg-slate-50 flex flex-col items-start justify-start gap-6 p-4 pt-6 lg:pl-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="= bg-slate-50 w-full p-8 max-w-full md:max-w-2xl lg:max-w-3xl h-auto min-h-[400px] rounded-xl shadow-md md:shadow-lg  flex flex-col gap-4 items-start justify-start">


            <div className="flex  w-full flex-col gap-2">
              <div className="flex  w-full p-2 border-b border-gray-200 flex-col items-start ">
                <div className=" w-full flex  items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">{job?.title}</h2>
                  <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-3xl">
                    {job?.status}
                  </span>
                </div>
                <div className=" w-full flex items-center gap-1 text-gray-600 font-medium">
                  <IoLocation />
                  <span >{job?.location}</span>
                </div>
              </div>


              <div className=" flex  w-full flex-col">
                <p className="text-sm w-full  text-gray-400 mb-3">Posted on: {formatDate(job?.createdAt)}</p>
                <div className="flex items-center w-full mt-2 gap-4 mb-2">
                  <div className="bg-emerald-100 rounded-full px-2 py-1 text-emerald-700 text-sm"> {formatSalary(job?.salaryRange)}</div>
                  <div className="flex items-center gap-1 bg-yellow-100 rounded-full px-2 py-1 text-orange-700 text-sm">
                    <LuBriefcase /> {job?.experience} years of experience</div>
                  <div className="flex items-center gap-1 bg-blue-100 rounded-full px-2 py-1 text-blue-700 text-sm">
                    <span><IoLocationOutline /></span> {job?.jobType}
                  </div>
                </div>
                <div className=" mt-3  w-full mb-1">
                  <h3 className="w-full font-semibold text-gray-700  mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job?.skillsRequired?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 w-full  mb-1">
                  <h3 className="font-semibold text-gray-700 mt-2 mb-1">Job Description</h3>
                  <p className="text-gray-600 w-full rounded-md p-2 italic shadow-sm">{job?.description}</p>
                </div>
                <div className="flex w-full bg-gray-600 rounded-lg p-0  justify-around mb-2 mt-6">
                  <button onClick={() => { setApplicantsView(true); getApplicants(); }} className=" bg-blue-100 border-r-2 px-2 py-1 border-gray-300 rounded-l-md w-full text-base font-medium ">Applicants</button>
                  <button onClick={() => setUpdateJobModal(true)} className=" bg-gray-200 w-full px-2 py-1 text-base font-medium">Update </button>
                  <button onClick={() => setDeleteModal(true)} className="bg-red-200 border-l-2 border-gray-300 px-2 py-1 rounded-r-md w-full text-base font-medium">Delete</button>
                </div>



              </div>
            </div>

          </motion.div>
          {applicantsView && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              animate={{ opacity: 1, y: 0 }}
              className=" bg-slate-50 w-[82%] max-w-[82%] md:max-w-2xl lg:max-w-3xl p-8 mt-4  h-auto min-h-[400px] rounded-xl  shadow-md md:shadow-lg  flex flex-col items-start gap-4 justify-start">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Applicants for this job</h2>
              {applicants.length === 0 ? (
                <p className="text-gray-600 italic">No applicants yet.</p>
              ) : (
                <div className="flex flex-col p-0 w-full rounded-md  gap-3">

                  {applicants.map((applicant) => (

                    <div key={applicant._id}
                      className="relative border border-gray-300 rounded-lg p-2">
                      
                        <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2
                ${applicant.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-500'}`}>
                          • {applicant.status}
                        </span>
                        <IoIosArrowForward
                          className="absolute right-4 top-10 text-xl text-gray-500 font-bold"
                          onClick={() => toProfilePage(applicant.candidateId.userName, applicant._id)}
                           />
                     
                      <div className="w-full flex items-start gap-2">
                        <img
                          src={applicant.candidateId.profileImage}
                          alt={applicant.candidateId.firstName}
                          className="w-16 h-16 rounded-full object-cover" />

                        <div className="flex flex-col w-full justify-start gap-0 ">
                          <h3 className="font-semibold mt-2 text-base text-gray-600">{applicant.candidateId.firstName} {applicant.candidateId.lastName}</h3>
                          <p className="text-gray-600 text-sm">{applicant.candidateId.headline}</p>
                        </div>
                      </div>

                      <div className="w-full flex items-center justify-between">
                        <div>{applicant.candidateId.skills.map((skill, index) => (
                          <span key={index} className="text-sm text-gray-500">{skill} | </span>))}
                        </div>
                        <button className="text-sm text-emerald-500" onClick={() => window.open(applicant.resume, '_blank')}><FaFile className="inline-block mr-1 text-sm text-emerald-500" />Resume</button>
                      </div>


                      <p className="text-gray-600">{applicant.candidateId.email}</p>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>


<div className="w-full max-w-full md:max-w-2xl lg:max-w-3xl mt-4">
        <button
          onClick={() => navigate(-1)}
          className="pl-5 group flex items-center gap-2 text-gray-500 hover:text-gray-800 
                         mt-6 transition-colors"
        >
          <IoArrowBack className='text-gray-500 hover:text-gray-800 font-medium text-lg' />
          <span className='text-gray-500 hover:text-gray-800 font-medium text-lg'>Back to jobs</span>
        </button>
        </div>

      </div >
    </>
  )
}

export default JobDetailRecruiter
