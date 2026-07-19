import React from 'react'
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { UserDataContext } from '../context/UserContext.jsx';
import { AuthDataContext } from '../context/AuthContext.jsx';
import JobCardBody from '../components/jobs/JobCardBody.jsx';
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import JobCardBodyRecruiter from '../components/jobs/JobCardBodyRecruiter.jsx';
import EditProfile from '../components/ui/EditProfile.jsx';
import axios from 'axios';
import { SearchQueryContext } from '../context/SearchContext.jsx';

const Home = () => {

    const { userData } = React.useContext(UserDataContext);
    const { serverUrl } = React.useContext(AuthDataContext);
    const { searchQuery, searchScope } = React.useContext(SearchQueryContext);
    const isRecruiter = userData?.userType === 'recruiter';
    const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
    // const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [jobs, setJobs] = React.useState([]);
    const [editProfileOpen, setEditProfileOpen] = React.useState(false);


    React.useEffect(() => {
        const fetchjobs = async () => {
            setLoading(true);
            try {
                if (isRecruiter) {
                    const result = await axios.get(serverUrl + '/api/job/getmyjobs', { withCredentials: true });
                    setJobs(result.data.jobs ?? []);
                    // console.log(result.data);
                } else if (!isRecruiter) {
                    const result = await axios.get(serverUrl + '/api/job/alljobs', { withCredentials: true });
                    setJobs(result.data.jobs ?? []);
                    // console.log(result.data);
                }
            } catch (e) {
                console.error("Error fetching jobs:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchjobs();
    }, []);


    
    const filteredJobs = (searchQuery.trim().toLowerCase() && searchScope == 'jobs' ) ? jobs.filter((a) =>
        a.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        a.companyName?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        a.skillsRequired?.some(d => d.toLowerCase().includes(searchQuery.trim().toLowerCase()))

    ) : jobs;


    let isProfileIncomplete;
    

    if (userData?.userType === 'recruiter') {
        if (!userData?.organization?.organizationName || !userData?.location) {
            isProfileIncomplete = true;
        } else {
            isProfileIncomplete = false;
        }
    } else {
        isProfileIncomplete = false;
    }



    return (
        <div className="min-h-screen w-full bg-slate-50">
            {editProfileOpen && <EditProfile setEditProfileOpen={setEditProfileOpen} />}

            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            />

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

            {/* Main content */}
            {/* Home.jsx */}
            <div className=" mt-[80px] lg:ml-[280px] ">

                <div className="max-w-xl mx-auto p-4 lg:max-w-3xl lg:mx-0 lg:px-6">
                    {loading ? <p>Loading your Jobs...</p> : null}
                    {jobs.length === 0 && (<p>No Jobs found!</p>)}
                    {isProfileIncomplete && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 mt-2 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">Complete your profile</p>
                                <p className="text-xs text-amber-600 mt-1">Add your company name and location before posting jobs.</p>
                            </div>
                            <button
                                onClick={() => setEditProfileOpen(true)}
                                className="bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-600"
                            >
                                Complete Profile
                            </button>
                        </div>
                    )}
                    {filteredJobs.length === 0 && searchQuery && (
                        <p className="text-gray-500 italic">No jobs found for "{searchQuery}"</p>
                    )}
                    {!isRecruiter && <JobCardBody filteredJobs={filteredJobs} showHeader={true}/>}
                    {isRecruiter && <JobCardBodyRecruiter filteredJobs={filteredJobs} isProfileIncomplete={isProfileIncomplete} />}


                </div>
            </div>
        </div>

    )
}

export default Home
