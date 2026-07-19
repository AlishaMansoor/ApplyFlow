import axios from 'axios';
import React from 'react'
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';
import JobCard from './JobCard.jsx';
import { useNavigate } from 'react-router-dom';

const JobCardBody = ({ filteredJobs, showHeader = true }) => {
    const { serverUrl } = React.useContext(AuthDataContext);
    const { userData } = React.useContext(UserDataContext);
    const navigate = useNavigate();

    const navigateToJobDetail = (selectedJob) => {
        try {
            navigate(`/job/${selectedJob._id}`, { state: { job: selectedJob } });
        } catch (e) {
            console.error("Error navigating to job details:", e);
        }
    }
    const isOwnProfile = userData



    return (
        <div className="w-full bg-slate-50 flex flex-col gap-10 justify-start p-0 max-w-2xl lg:max-w-none lg:mx-0">
 {showHeader && ( 
            <div>
                <p className="text-xl font-semibold text-gray-700  mt-2 ">Explore jobs</p>
                <p className='font-normal text-sm italic text-gray-500'> Find opportunities that match your skills and goals.</p>
            </div>
 )}
            
            {filteredJobs.map((b) => <JobCard key={b._id} job={b} onClick={() => { navigateToJobDetail(b) }} />)}
        </div >
    )

}
export default JobCardBody
