import React from 'react'
import axios from 'axios';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion'
import { RxCross2, RxRadiobutton } from "react-icons/rx";
import { AuthDataContext } from '../../context/AuthContext';

function UpdateJobModal({ setUpdateJobModal, job, setJob }) {
    const { serverUrl } = useContext(AuthDataContext);
    const [status, setStatus] = useState(job?.status || 'Open');
    const [description, setDescription] = useState(job?.description || '');
    const [experience, setExperience] = useState(job?.experience || 0);
    const [jobType, setJobType] = useState(job?.jobType || 'Full-time');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validateExperience, setValidateExperience] = useState("");
    
    const validateExperienceChange = (newValue) => {
        const original = job?.experience;
        const difference = Math.abs(Number(newValue) - Number(original));
        if (difference === 1 && newValue >= 0) return true;
        if(Number(newValue) === Number(original)) return true;
        return false;

    }
    const preventEnterSubmit = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); 
  }
};
    const handleJobUpdate = async (jobId) => {
        setLoading(true);
        setError('');
        setSuccess('');

  const isValid = validateExperienceChange(experience);
  console.log("validation result:", isValid);
  console.log("experience:", experience, "job.experience:", job?.experience);
  
  if (!isValid) {
    setError("Experience can only differ by one unit");
    setLoading(false);
    return;
  }
        try {
            console.log("UpdateHandleJob hit!")
            if (!jobType) { setError("Provide job type"); return; }
            if (!status) { setError("Provide job status"); return; }
            if (!description) { setError("Provide job description"); return; }
            if (experience === '' || experience === null || experience === undefined) { setError("Provide experience"); return; }

            const result = await axios.put(`${serverUrl}/api/job/${jobId}`, { experience: Number(experience), jobType, status, description }, { withCredentials: true });
            console.log("before setting job");
            setJob(result.data.job);
             console.log("after setting job")
            setSuccess("Job Updated Successfully");
            setTimeout(() => setUpdateJobModal(false), 2000)
        } catch (e) {
            console.error("DEBUG ERROR:", e);
            console.log(e.response?.data?.message || "Error updating job")
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white relative max-h-[90vh] overflow-y-auto w-[90%] md:max-w-3xl p-6 rounded-xl shadow-xl flex flex-col gap-4"
            >
                <button onClick={() => setUpdateJobModal(false)}
                    className="absolute right-2 top-3 text-gray-600 hover:text-gray-800 ">
                    <RxCross2 className="w-7 h-7" />
                </button>
                <div className="flex flex-col w-full gap-0 ">
                    <h2 className="text-lg font-semibold text-gray-700">Update job</h2>
                    <p className="text-sm italic text-gray-600 mb-1">You can only update below listed feilds.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleJobUpdate(job._id) }} className="flex flex-col w-full overflow-y-auto md:max-w-2xl lg:max-w-3xl  gap-2 p-1 rounded">

                    <label className="text-base font-medium text-gray-600">Experience</label>
                    <input type="number" onKeyDown={preventEnterSubmit} placeholder="0/+1/+2/+3...years" min={experience - 1} max={experience + 1} value={experience} onChange={(e) => setExperience(e.target.value)} className="border-2 py-1 px-2 text-gray-500 border-gray-300 rounded-md focus:outline-none focus:border-gray-400" />
                    <p className="text-sm italic mb-2 text-gray-600">You can only update experience by one unit.</p>
                    {validateExperience && <div className="text-red-500 text-sm w-full">{validateExperience}</div>}

                    <div className="w-full flex gap-2 mb-1 flex-col">
                        <label className="text-base font-medium text-gray-600">Job type</label>
                        <select className="border-2 py-1 px-2  border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-gray-500" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                            <option value="Full-time">Full-time</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-base font-medium text-gray-600">Job status</label>

                        <div className="gap-8 w-full pl-1  flex items-center">
                            <div className="gap-2 flex">
                                <input type="radio" value="Open" onChange={(e) => setStatus(e.target.value)} checked={status === "Open"} />
                                <label>Open</label>
                            </div>
                            <div className="gap-2 flex">
                                <input type="radio" value="Closed" onChange={(e) => setStatus(e.target.value)} checked={status === "Closed"} />

                                {/* User clicks "Open" radio
                                  ↓
                                onChange fires → setStatus("Open")
                                  ↓
                                status state updates to "Open"
                                  ↓
                                React re-renders
                                  ↓
                                checked={status === "Open"} → true → radio selected 
                                checked={status === "Close"} → false → radio unselected  */}

                                <label>Closed</label>
                            </div>
                        </div>
                    </div>



                    <label className="text-base font-medium text-gray-600">Description</label>
                    <textarea placeholder="" onKeyDown={preventEnterSubmit} value={description} rows={5} onChange={(e) => setDescription(e.target.value)} className="border-2 py-1 px-2 text-gray-500 border-gray-300 rounded-md focus:outline-none focus:border-gray-400 overflow-y-auto" />


                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-emerald-600 text-sm">{success}</p>}

                    <button type="submit" disabled={loading} className='right-0 mt-3 rounded-full text-lg font-medium bg-emerald-500 hover:bg-emerald-600 px-4 text-gray-900 py-2'>
                        {loading ? "Updating..." : "Update"}</button>

                </form>
            </motion.div>
        </div>
    )
}

export default UpdateJobModal
