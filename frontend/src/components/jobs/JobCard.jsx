import React from 'react'
import { motion } from 'framer-motion'
import { GrLocationPin } from "react-icons/gr";
import { IoLocationOutline } from 'react-icons/io5'
import { formatDate, formatSalary } from '../../utils/helperfunc.js';
import { AuthDataContext } from '../../context/AuthContext.jsx'
import axios from 'axios';



const JobCard = ({ job, onClick }) => {

  
 
 return (
        <motion.div
            whileHover={{
                y: -4,
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className='w-full bg-slate-50 rounded-xl shadow-lg hover:shadow-xl gap-2 border border-gray-300  flex flex-col items-start justify-start ' onClick={onClick}>
            <div className='w-full p-4   flex-1'>
                <div className='w-full mb-2'>
                    <h1 className="text-gray-900 font-semibold ">{job.title}</h1>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <h4 className="text-gray-600 font-medium">{job.companyName}</h4>
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
                <div className="text-gray-500 text-sm line-clamp-2 border border-gray-300 p-1 rounded-md">
                    <p className="p-1 font-medium mb-1">Job Description :</p>
                    <hr className='mb-1' />
                    {job.description}
                </div>
            </div>

            <div className='w-full flex justify-end items-center gap-4 bg-gray-300 p-3 rounded-b-xl mt-3'>
                <button  className="bg-gray-500 text-sm font-medium text-white py-2 px-3 rounded-md hover:bg-gray-600">Save</button>
                <button className="bg-emerald-500 text-sm font-medium text-white py-2 px-3 rounded-md hover:bg-emerald-600">Apply</button>
            </div>
        </motion.div>




    )
}

export default JobCard
