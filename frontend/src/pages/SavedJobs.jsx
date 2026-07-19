import React from 'react'
import { AuthDataContext } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { AnimatePresence } from 'framer-motion';
import axios from 'axios'
import SavedApplicationCard from '../components/jobs/SavedJobCard.jsx';
import { useNavigate } from 'react-router-dom';

function SavedApplication() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
  const [savedJobs, setSavedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { serverUrl } = React.useContext(AuthDataContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchsavedJobs = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          serverUrl + '/api/user/savedjobs',
          { withCredentials: true }
        );
        setSavedJobs(result.data.savedJobs ?? []);
      } catch (e) {
        console.error("Error fetching Saved jobs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchsavedJobs();
  }, []);
 

   const deleteSavedJob = async (jobId) => {
        try {
            const response = await axios.delete(serverUrl + '/api/user/deletesavedjob/'+jobId, { withCredentials: true })
            setSavedJobs(prev=> prev.filter(j=>j._id !== jobId));
        } catch (e) {
            console.error("Error removing from Saved jobs:", e);
        }
    }

    const navigateToJobDetail = (job) => {
        try {
            navigate(`/job/${job._id}`, { state: { job } });
        } catch (e) {
            console.error("Error navigating to job details:", e);
        }
    }


  return (
    <div>
   
  
    <div>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className='lg:hidden'>
        
          {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        
      </div>
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      <div className="lg:ml-[280px] max-w-xl mx-auto  p-4 lg:max-w-3xl lg:mx-0 lg:px-8 mt-[80px] m-3">
        <div className='gap-0 flex flex-col mb-3'>
          <p className="text-xl font-semibold text-gray-700  mt-2 ml-2 ">Saved Jobs</p>
          {!loading && savedJobs.length !== 0 && (<p className='text-sm italic font-normal text-gray-500 ml-2 '>Your Saved jobs are listed below.</p>)}
        </div>
        {loading && <p className="text-gray-500">Loading jobs...</p>}

        {!loading && savedJobs.length === 0 && (
          <p className="text-gray-400 mt-5 ml-2 text-lg">You haven't Saved any jobs yet.</p>
        )}

        <div className=" p-2  flex flex-col gap-6 ">
          {!loading && savedJobs.map((savedJob) => (
            <SavedApplicationCard key={savedJob._id} job={savedJob} deleteSavedJob={deleteSavedJob} onClick={() => navigateToJobDetail(savedJob)} />
          ))}
        </div>
      </div>

    </div>
  


    </div>
  )
}

export default SavedApplication
