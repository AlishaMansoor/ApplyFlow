import React from 'react'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import { AnimatePresence } from 'framer-motion';
import { AuthDataContext } from '../context/AuthContext.jsx'
import axios from 'axios'
import ApplicationCard from '../components/jobs/ApplicationCard.jsx'


const Myapplications = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { serverUrl } = React.useContext(AuthDataContext);

  React.useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          serverUrl + '/api/application/myapplications',
          { withCredentials: true }
        );
        setApplications(result.data.applications ?? []);
      } catch (e) {
        console.error("Error fetching applications:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);
 

   const deleteApplication = async (applicationId) => {
        try {
            const response = await axios.delete(serverUrl + '/api/application/delete/'+applicationId, { withCredentials: true })
            setApplications(prev=> prev.filter(a=>a._id !== applicationId));
        } catch (e) {
            console.error("Error withdrawing application:", e);
        }
    }

  return (
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
          <p className="text-xl font-semibold text-gray-700  mt-2 ml-2 ">My Applications</p>
          {!loading && applications.length !== 0 && (<p className='text-sm italic font-normal text-gray-500 ml-2 '>Jobs you applied to are listed below.</p>)}
        </div>
        {loading && <p className="text-gray-500">Loading applications...</p>}

        {!loading && applications.length === 0 && (
          <p className="text-gray-400 mt-5 ml-2 text-lg">You haven't applied to any jobs yet.</p>
        )}

        <div className=" p-2  flex flex-col gap-6 ">
          {!loading && applications.map((app) => (
            <ApplicationCard key={app._id} application={app} deleteApplication={deleteApplication}/>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Myapplications
