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
import { JobDataContext } from '../context/JobContext.jsx';
import JobCardSkeleton from '../components/ui/JobCardSkeleton.jsx';
import JobCardRecruiterSkeleton from '../components/ui/JobCardRecruiterSkeleton.jsx';
import CreateJobModal from '../components/jobs/CreateJobModal.jsx';

const Home = () => {

    const { userData } = React.useContext(UserDataContext);
    const { serverUrl } = React.useContext(AuthDataContext);
    const { jobs, setJobs, fetchAllJobs, fetchMyJobs, loading } = React.useContext(JobDataContext);
    const { searchQuery, searchScope } = React.useContext(SearchQueryContext);
    const isRecruiter = userData?.userType === 'recruiter';
    const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);
    // const [searchQuery, setSearchQuery] = React.useState('');
    // const [loading, setLoading] = React.useState(false);
    // const [jobs, setJobs] = React.useState([]);
    const [editProfileOpen, setEditProfileOpen] = React.useState(false);
    const [createJobOpen, setCreateJobOpen] = React.useState(false);


    React.useEffect(() => {
        isRecruiter ? fetchMyJobs() : fetchAllJobs();
    }, [isRecruiter]);

    // console.log(userData);

    const filteredJobs = React.useMemo(() => (
        (searchQuery.trim().toLowerCase() && searchScope == 'jobs'
        ) ? jobs.filter((a) =>
            a.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            a.companyName?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            a.skillsRequired?.some(d => d.toLowerCase().includes(searchQuery.trim().toLowerCase()))

        ) : jobs
    ), [searchQuery, searchScope, jobs]);


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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
        {editProfileOpen && <EditProfile setEditProfileOpen={setEditProfileOpen} />}
        {createJobOpen && <CreateJobModal setCreateJobOpen={setCreateJobOpen} />}

        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
        <div className="mt-[80px] min-h-[calc(100vh-80px)] lg:ml-[280px] flex flex-col">

            <div className={`p-4 max-w-xl mx-auto  w-full lg:max-w-3xl lg:mx-0 lg:px-6 flex-1 flex flex-col ${!loading && jobs.length === 0 ? 'items-center justify-center lg:justify-start lg:mt-8' : ''}`}>

                {isProfileIncomplete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 mt-2 flex items-center justify-between w-full">
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

                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        isRecruiter ? <JobCardRecruiterSkeleton key={index} /> : <JobCardSkeleton key={index} />
                    ))
                ) : jobs.length === 0 ? (
                    <div className="h-[340px] lg:h-[340px] lg:mt-4 w-full border-gray-200 border shadow-md rounded-lg  flex flex-col items-center justify-center text-center px-4">
                        <p className="text-gray-500 text-base font-medium  lg:font-semibold italic">
                            {isRecruiter ? "You haven't posted any jobs yet." : "No jobs found!"}
                        </p>
                        <p className="text-gray-400 text-sm italic mt-1">
                            {isRecruiter ? "Post your first job to get started." : "Check back later for new openings."}
                        </p>
                        <button
                        disabled={isProfileIncomplete}
                            onClick={() => setCreateJobOpen(true)}
                            className="mt-4 bg-emerald-600 text-slate-50 font-medium px-4 py-2 rounded-3xl hover:bg-emerald-700"
                        >
                            Add Job
                        </button>
                    </div>
                ) : (
                    <>
                        {filteredJobs.length === 0 && searchQuery && (
                            <p className="text-gray-500 italic mt-4">No jobs found for "{searchQuery}"</p>
                        )}

                        {!isRecruiter && <JobCardBody filteredJobs={filteredJobs} showHeader={true} />}
                        {isRecruiter && <JobCardBodyRecruiter filteredJobs={filteredJobs} isProfileIncomplete={isProfileIncomplete} />}
                    </>
                )}

            </div>
        </div>
    </div>
)
}

export default Home
