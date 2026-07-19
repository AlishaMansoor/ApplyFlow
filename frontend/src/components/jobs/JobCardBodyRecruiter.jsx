import React from 'react'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import JobCardRecruiter from './JobCardRecruiter'
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateJobModal from './CreateJobModal.jsx';
import { BsPlusSquareFill } from "react-icons/bs";

function JobCardBodyRecruiter({ filteredJobs, isProfileIncomplete }) {

    const [createJobOpen, setCreateJobOpen] = React.useState(false);
    const { serverUrl } = React.useContext(AuthDataContext);
    const {userData} = React.useContext(UserDataContext);
    const navigate = useNavigate();

    if (userData?.userType === 'recruiter') {
        if (!userData?.organization?.organizationName || !userData?.location) {
            isProfileIncomplete = true;
        } else {
            isProfileIncomplete = false;
        }
    } else {
        isProfileIncomplete = false;
    }


    const navigateToJobDetailRecruiter = (selectedJob) => {
        try {
            navigate(`/job/recruiter/${selectedJob._id}`, { state: { job: selectedJob } });
        } catch (e) {
            console.error("Error navigating to job details:", e);
        }
    }


    // if (filteredJobs.length === 0) return <div>No jobs found</div>;
    return (
        <>
            {createJobOpen && (
                <CreateJobModal
                    setCreateJobOpen={setCreateJobOpen}
                />
            )}
            <div className="w-full bg-slate-50 flex flex-col gap-4 justify-start max-w-2xl lg:max-w-none lg:mx-0">
                <div className="flex bg-slate-50 items-center justify-between mb-0">
                    {filteredJobs.length !== 0 && (
                        <div className="w-full">
                            <p className="text-xl font-semibold text-gray-700  mt-2 ">Your jobs</p>
                            <p className='font-normal text-sm italic text-gray-500'> Manage your job postings and track applications.</p>

                        </div>
                    )}
                    <div className='fixed z-40 right-6 bottom-10 flex flex-col justify-center items-center'>
                        <button
                            onClick={() =>  {
                                if (isProfileIncomplete) {
                                toast.warning("Please complete your profile before posting a job.");
                                return; }
                                setCreateJobOpen(true)}}
                            className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 text-3xl font-semibold"
                        >+</button>
                        <p className='text-gray-700 text-xs font-medium mb-1'>Add job</p>
                    </div>
                </div>
                <div>

                </div>
                {
                    filteredJobs.map((b) =>
                        <JobCardRecruiter key={b._id} job={b} onClick={() => { navigateToJobDetailRecruiter(b) }} />
                    )}
            </div >
        </>
    )
}

export default JobCardBodyRecruiter
