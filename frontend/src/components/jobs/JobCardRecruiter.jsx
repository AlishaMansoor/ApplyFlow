import React from 'react'
import { motion } from 'framer-motion'
import { GrLocationPin } from "react-icons/gr";
import { IoLocationOutline } from 'react-icons/io5'
import { formatDate, formatSalary } from '../../utils/helperfunc.js';
import { AuthDataContext } from '../../context/AuthContext.jsx'
import axios from 'axios';



const JobCardRecruiter = ({ job, onClick }) => {

  
 
 return (
        <motion.div
    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className='w-full bg-slate-50 rounded-xl shadow-lg hover:shadow-xl border border-gray-300 flex flex-col cursor-pointer'
    onClick={onClick}
>
    <div className='p-4 flex-1 w-full'>

        {/* title + status badge */}
        <div className='w-full flex items-start justify-between mb-1'>
            <h1 className="text-gray-700 text-lg font-semibold">{job.title}</h1>
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2
                ${job.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'}`}>
                • {job.status}
            </span>
        </div>

        {/* posted date */}
        <p className="text-xs text-gray-400 mb-3">Posted on {formatDate(job.createdAt)}</p>

        <hr className="w-full mb-3 border-gray-200" />

        {/* job type + salary + experience */}
        <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-50 text-blue-500 text-sm px-2 py-1 rounded-full">
                {job.jobType}
            </span>
            <span className="bg-emerald-50 text-emerald-500 text-sm px-2 py-1 rounded-full">
                {formatSalary(job.salaryRange)}
            </span>
            {job.experience !== undefined && (
                <span className="bg-amber-50 text-amber-600 text-sm px-2 py-1 rounded-full">
                    {job.experience === 0 ? 'Fresher' : `${job.experience}+ yrs exp`}
                </span>
            )}
        </div>

        {/* skills */}
        <div className='flex flex-wrap gap-2 mb-3'>
            <p className='text-sm font-medium text-gray-500'>Skills :</p>
            {job.skillsRequired?.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">
                    {skill}
                </span>
            ))}
        </div>

        {/* applicants count */}
        <div className="flex  bg-blue-50 text-blue-500 items-center gap-1  border border-gray-200 rounded-lg px-3 py-1 w-fit">
            <span className="text-sm font-medium ">
                {job.applicantsCount ?? 0} Applicants
            </span>
        </div>

    </div>

    {/* footer — click anywhere on card navigates, buttons are just visual indicators */}
    <div className='w-full flex justify-end items-center gap-3 bg-gray-100 border-t border-gray-200 p-3 rounded-b-xl'>
        <span className="bg-emerald-500 text-base font-medium text-white py-1.5 px-3 rounded-md">
            Edit
        </span>
        <span className="bg-red-500 text-base font-medium text-white py-1.5 px-3 rounded-md">
            Delete
        </span>
        
    </div>
</motion.div>




    )
}

export default JobCardRecruiter
