import React, { useRef } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { FaFileUpload } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { UserDataContext } from '../../context/UserContext.jsx';
import { AuthDataContext } from '../../context/AuthContext.jsx';




const ApplyModal = ({ job, setApplyNowOpen }) => {
  // console.log("current job", job);
  const { serverUrl } = React.useContext(AuthDataContext);
  const { userData } = React.useContext(UserDataContext);
  const [resumeInputTrigger, setResumeInputTrigger] = React.useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const getViewableResumeUrl = (url) => {
    return url.endsWith('.pdf') ? url : url + '.pdf';
  }


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setSuccess("");
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the 5MB limit.");
      return;
    }
    setSelectedFile(file);

  }

  const applyToJobHandler = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const formdata = new FormData();
      formdata.append("jobId", job._id)

      if (resumeInputTrigger && selectedFile) {
        formdata.append("resume", selectedFile);
      } else if (userData?.resume && !resumeInputTrigger) {
        formdata.append("resume", userData.resume);
      } else {
        setError("Please select a resume to apply.");
        setLoading(false);
        return;
      }


      const result = await axios.post(serverUrl + '/api/application/applyjob', formdata, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true })
      console.log("applied to job");
      setLoading(false);
      setSelectedFile(null);
      setSuccess(`Applied to ${job.title} successfully!`);
      setTimeout(() => setApplyNowOpen(false), 2000);

    } catch (e) {
      console.log("Error Applying to job", e);
      setError(e?.response?.data?.message || "Failed to apply.");

    } finally {
      setLoading(false);
    }
  }

  console.log("userData.resume:", userData?.resume);

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
        <div className='bg-white rounded-lg p-6 w-[90%] h-auto max-w-md flex flex-col items-start justify-center mb-4'>
          <h2 className="text-xl font-semibold mb-1">Apply for {job.title}</h2>
          <p className="text-gray-500 text-sm mb-4 ">{job.companyName}</p>

          {/* user HAS resume and hasn't clicked "apply with another" */}
          {/* {userData?.resume && !resumeInputTrigger && ( */}
          {userData?.resume && userData.resume.trim() !== '' && !resumeInputTrigger && (

            <div className='w-full  rounded-md p-2 flex flex-col '>
              <div className=" w-full p-2 rounded-md flex flex-col gap-2">

                <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-md flex items-center gap-3">
                  <FaFilePdf className="ml-4 w-8 h-8 text-emerald-400 " />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resume on file</p>
                    <p className="text-xs text-gray-500">PDF uploaded to cloud</p>
                  </div>
                </div>
                <a href={getViewableResumeUrl(userData.resume)} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full">
                  View current resume</a>
                {/* {console.log("Resume URL:", userData.resume)} */}

              </div>
              <div className="pl-2 pr-2 gap-2 flex flex-col rounded-md ">
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full mt-1"
                  onClick={() => { setResumeInputTrigger(true) }}>
                  Apply with another resume
                </button>
                <p className="text-sm px-3 text-gray-500">
                  Using a different resume won't change your profile resume. </p>
              </div>
            </div>
          )}
          {/* no resume OR clicked "apply with another" */}
          {/* {resumeInputTrigger && ( */}
          {(!userData?.resume || userData.resume.trim() === '' || resumeInputTrigger) && (


            <div className="w-full">
              {/* warning message only when no resume at all */}
              {!resumeInputTrigger && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                  <p className="text-sm text-amber-700 font-medium">No resume on file</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Upload a resume to apply for this job.
                  </p>
                </div>
              )}
              <div
                onClick={() => {fileInputRef.current?.click();  setResumeInputTrigger(true)}}
                className=" border-2 border-dotted border-emerald-400 pt-6 pb-6 mb-3 rounded-md flex flex-col items-center  cursor-pointer">
                <FaFileUpload className='w-6 h-6 mt-3 mb-2 text-emerald-400' />
                <p className="text-sm font-medium mb-0">Click to select a PDF</p>
                <p className="text-xs mb-2">Max file size:5MB</p>
              </div>
              {/* //now fileInputRef.current point to jsx element(input) in DOM (added this input to DOM via ref) */}
              <input
                ref={fileInputRef}
                type="file" accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-emerald-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          )}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 text-center mb-2 mt-2"
              >{error}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-emerald-600 text-center mb-2 mt-2"
              >{success}
              </motion.p>
            )}
          </AnimatePresence>

          <div className=' mt-6 flex w-full justify-end gap-3'>

            <button
              type="button"
              onClick={() => setApplyNowOpen(false)}
              className="  bg-gray-300 text-gray-900 py-2 font-medium text-normal rounded-md hover:bg-gray-400 transition-colors duration-300 p-3 m-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => applyToJobHandler(job)}
              className="  bg-emerald-500 text-white py-2 font-medium text-normal rounded-md hover:bg-emerald-600 transition-colors duration-300 p-3 m-1"
            >
              {loading ? "Applying..." : "Apply"}
            </button>

          </div>
        </div>


      </div>


    </div>
  )
}

export default ApplyModal
