import React from 'react'
import { motion } from 'framer-motion'
import { IoLocationOutline } from 'react-icons/io5'
import { FaFilePdf } from 'react-icons/fa6'
import { AuthDataContext } from '../../context/AuthContext.jsx'
import { formatDate, formatSalary } from '../../utils/helperfunc.js'
import axios from 'axios'
import DeleteApplicationModal from '../ui/DeleteApplicationModal.jsx'

const statusConfig = {
    Applied: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    Interview: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    Accepted: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
}

const ApplicationCard = ({ application,setApplication, deleteApplication }) => {
    // console.log("current application", application)
    const { jobId: job, resume, status, createdAt } = application;
    const skillsRequired = application?.jobId?.skillsRequired;
    // console.log("skiils required for current application", skillsRequired);
    const s = statusConfig[status] || statusConfig['Applied'];
    const { serverUrl } = React.useContext(AuthDataContext);
    const [deleteModal, setDeleteModal] = React.useState(false);
    
    const getViewableResumeUrl = (url) => {
        return url.endsWith('.pdf') ? url : url + '.pdf';
    };

    

    return (
        <>{deleteModal && (
            <DeleteApplicationModal setDeleteModal={setDeleteModal} applicationId={application._id} deleteApplication={deleteApplication} />
        )}
       
        <motion.div
            whileHover={deleteModal ? {} : { y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
            whileTap={deleteModal ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className='w-full bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col items-start'
        >
            <div className='p-4 flex-1 w-full'>

                {/* Job title + status badge */}
                <div className='w-full flex items-start justify-between mb-1'>
                    <h1 className="text-gray-900 font-semibold">{job?.title}</h1>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {status}
                    </span>
                </div>

                {/* Company + location */}
                <div className='flex items-center justify-between gap-4 mb-3'>
                    <h4 className="text-gray-600 font-medium">{job?.companyName}</h4>
                    <div className='pr-2 text-gray-700 text-sm'>
                        <IoLocationOutline className="inline-block mb-0.5" /> {job?.location}
                    </div>
                </div>

                <hr className="w-full mb-2 border-gray-200" />

                {/* Applied date */}
                <div className="text-xs mb-3 text-gray-400">
                    Applied on {formatDate(createdAt)}
                </div>

                {/* Job type + salary badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {job?.jobType}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full">
                        {formatSalary(job?.salaryRange)}
                    </span>
                </div>

                {/* Skills */}
                <div className='flex flex-wrap text-gray-600 font-normal mb-3 gap-2'>
                    <p className='pl-1 font-medium'>Skills :</p>
                    {job?.skillsRequired?.map((skill, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Resume used */}
                {resume && (

                    <a href={getViewableResumeUrl(resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 w-fit hover:bg-emerald-100 transition-colors"
                    >
                        <FaFilePdf className="text-emerald-500 w-4 h-4" />
                        <span className="text-xs text-emerald-700 font-medium">View submitted resume</span>
                    </a>
                )}
            </div>

            {/* Footer */}
            <div className='w-full flex justify-end items-center gap-4 bg-gray-100 border-t border-gray-200 p-3 rounded-b-xl'>
                <button onClick={()=>setDeleteModal(true)} className="bg-red-50 text-red-500 border border-red-200 py-2 px-4 rounded-md hover:bg-red-100 text-sm font-medium transition-colors">
                    Withdraw
                </button>
            </div>
             
        </motion.div>
        </>
    )
}

export default ApplicationCard