import React, { lazy } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthDataContext } from '../context/AuthContext.jsx'
import { AnimatePresence, motion } from 'framer-motion'
import { IoArrowBack } from 'react-icons/io5'
import { IoLocationOutline } from 'react-icons/io5'
import { LuBriefcase } from 'react-icons/lu'
import { formatSalary, formatDate } from '../utils/helperfunc.js'
import ApplyModal from '../components/ui/ApplyModal.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx'
import { toast } from 'react-toastify'

const useJobDetail = (id, initialJob) => {
  const [job, setJob] = React.useState(initialJob || null);
  const [loading, setLoading] = React.useState(!initialJob);
  const [error, setError] = React.useState(null);
  const { serverUrl } = React.useContext(AuthDataContext);
  
  React.useEffect(() => {
    if (initialJob) return; // If we already have the job data, no need to fetch
    const fetchJob = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${serverUrl}/api/job/getjob/${id}`,
          { withCredentials: true }
        );
        setJob(result.data.job);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);
  return { job, loading, error };
}

const JobDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  //calling the custom hook to fetch job details
  const { job, loading, error } = useJobDetail(id, state?.job);
  const [applyNowOpen, setApplyNowOpen] = React.useState(false);
  //duplicating sidebarOpen and searchQuery here(fron Home.jsx)...but better would be to have a context of these (or any states) which are needed page to page.
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { serverUrl } = React.useContext(AuthDataContext);
  
  const saveApplication = async () => {
      try{
     const response= await axios.post(serverUrl + '/api/user/save', { jobId: id }, { withCredentials: true })
     toast.success("Job saved successfully!");
     
      }catch(e){
        console.log(e?.response?.data?.message || e.message);
            if (e?.response?.data?.message == "Job already saved") {
            toast.info("You've already saved this job.");  
        } else {
            toast.error("Failed to save job.");
        }
        console.error("Error saving application", e);
      }
  } 


  // guard clause( early return, no need to use ternary operators like {loading ? <LoadingComponent /> : error ? <ErrorComponent /> : <JobDetailComponent />})

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading job details...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500">Something went wrong: {error}</p>
    </div>
  );

  if (!job) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Job not found</p>
    </div>
  );


  return (
    <div className='min-h-calc(100vh - 80px) w-full flex items-start justify-start mt-[50px]  '>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="lg:hidden">
        {/* //For medium and small */}
       
          {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      
      </div>
      {/* //On large screens, sidebar is always open and doesn't need animation */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
      </div>
      {applyNowOpen && (<ApplyModal job={job} setApplyNowOpen={setApplyNowOpen} />)}
      {/* main job detail div */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className=" w-full max-w-3xl mx-auto px-6 pt-[80px] pb-10 lg:ml-[280px]"
      >



        <div className="bg-gray-50 w-full  rounded-2xl my-6 shadow-md border border-gray-100 p-6 
                      flex flex-col gap-5">

          {/* Header */}
          <div className="flex  w-full justify-between items-start">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <h2 className="text-emerald-600 font-medium mt-1">{job.companyName}</h2>
            </div>
            {/* Status  */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${job.status === 'Open'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'}`}>
              {job.status}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* details*/}
          <div className="flex flex-wrap  w-full gap-3">
            <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
              {job.jobType}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <IoLocationOutline />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <LuBriefcase />
              {job.experience} years exp.
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full">
              {formatSalary(job.salaryRange)}
            </span>
          </div>

          {/* Skills */}
          <div className=" w-full">
            <h3 className="font-semibold text-gray-700 mb-3">Skills Required</h3>
            <div className=" flex flex-wrap gap-2">
              {job.skillsRequired?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className=" w-full">
            <h3 className="font-semibold text-gray-700 mb-3">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>


          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Posted on {formatDate(job.createdAt)}
            </span>
            <div className="flex gap-3">
              <button onClick={saveApplication} 
              className="border border-gray-200 text-gray-600 px-3
                               rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors font-medium text-sm">
                Save
              </button>
              <button
                onClick={() => setApplyNowOpen(true)}
                className="bg-emerald-500 text-white py-2 px-4 rounded-lg 
                               hover:bg-emerald-600 transition-colors text-sm font-medium">
                Apply Now
              </button>
            </div>
          </div>

        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 
                   mt-6 transition-colors"
        >
          <IoArrowBack className='text-gray-500 hover:text-gray-800 font-medium text-lg'/>
          <span className='text-gray-500 hover:text-gray-800 font-medium text-lg'>Back to jobs</span>
        </button>
      </motion.div>
    </div>
  )
}

export default JobDetail
