import React from 'react'
import { motion } from 'framer-motion'
import { IoLocationOutline } from 'react-icons/io5'
import { FaFilePdf } from 'react-icons/fa6'
import { AuthDataContext } from '../../context/AuthContext.jsx'
import { formatDate, formatSalary } from '../../utils/helperfunc.js'
import axios from 'axios'
import { GoBookmarkSlashFill } from "react-icons/go";

const getViewableResumeUrl = (url) => {
    return url.endsWith('.pdf') ? url : url + '.pdf';
};

const SavedApplicationCard = ({ job, deleteSavedJob, onClick }) => {

    const { serverUrl } = React.useContext(AuthDataContext);
 

    return (

        <motion.div
            whileHover={{y: -4,boxShadow: "0 12px 24px rgba(0,0,0,0.1)"}}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className='relative w-full bg-white rounded-xl shadow-lg hover:shadow-xl gap-2 border border-gray-300  flex flex-col items-center justify-center ' 
            onClick={onClick}
            >
            <div className='p-4  w-full flex-1'>
                <GoBookmarkSlashFill onClick={()=>deleteSavedJob(job._id)} className='absolute w-5 h-5 text-emerald-500 hover:text-emerald-600 right-2 top-3 '/>
                <div className='w-full mb-2'>
                    <h1 className="text-gray-900  w-full font-semibold ">{job.title}</h1>
                    <div className='flex  w-full items-center justify-between gap-4'>
                        <div className=' px-1'>
                            <h4 className="text-gray-600 w-full font-medium">{job.companyName}</h4>
                        </div>
                        <div className='pr-2 text-gray-950 text-md'><IoLocationOutline className="inline-block mb-1" />{job.location}</div>
                    </div>
                </div>

                <hr className="w-full mb-1 border-gray-300" />
                <div className="text-xs mb-2 text-gray-400">Posted on {formatDate(job.createdAt)}</div>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 font-normal text-blue-600 text-xs mb-3 px-2 py-1 rounded-full">
                        {job.jobType}
                    </span>
                    <span className="bg-emerald-50 font-normal text-emerald-600 text-xs mb-3 px-2 py-1 rounded-full">
                        {formatSalary(job.salaryRange)}
                    </span>
                </div>
                {/* <div className="text-sm pl-1 text-gray-500"></div> */}

                <div className='flex flex-wrap text-gray-600 font-normal mb-4 gap-2'><p className='pl-1 font-medium'>Skills :</p>
                    {job.skillsRequired?.map((a, index) => {
                        return <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{a}</span>
                    })}
                </div>
                <div className="text-gray-500 text-sm line-clamp-2 border border-gray-300 p-1 rounded-md mb-6">
                    <p className="p-1 font-medium mb-1">Job Description :</p>
                    <hr className='mb-1' />
                    {job.description}
                </div>
            </div>

            
        </motion.div>



    )
}

export default SavedApplicationCard