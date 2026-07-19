import React from 'react'
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { FaFile, FaFileUpload } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { UserDataContext } from '../../context/UserContext.jsx';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import DeleteResumeModal from './DeleteResumeModal.jsx';

function UploadResume({ setResumeOpen }) {

    const { serverUrl } = React.useContext(AuthDataContext);
    const { userData, setUserData } = React.useContext(UserDataContext);
    const [resumeInputTrigger, setResumeInputTrigger] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const fileInputRef = React.useRef(null);
    const [deleteResumeModal, setDeleteResumeModal] = React.useState(false);



    const uploadResumeHandler = async () => {
        try {
            if (!selectedFile) {
                setError("No file selected");
                return;
            }
            setLoading(true);
            const formData = new FormData();
            formData.append("resume", selectedFile);
            const response = await axios.put(serverUrl + "/api/user/updateresume", formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            // console.log("Resume upload response:", response.data);
            setUserData(prev => ({ ...prev, resume: response.data.resume }));
            setLoading(false);
            setSelectedFile(null);
            setSuccess("Resume uploaded successfully!");
        } catch (e) {
            console.log("Error in uploading resume", e);
            setError("Failed to upload resume.");
        }
    }



    const HandleFileChange = (e) => {
        console.log("file changed", e.target.files[0]);
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



    const HandleCancel = () => {
        const setFileInputTrigger = false;
        setSelectedFile(null);
        setError("");
        setLoading(false);
        setSuccess("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setResumeOpen(false);
    }


    const getPdfUrl = (url) => {
        return url.replace('/raw/upload/', '/raw/upload/fl_inline/');
        // return url.endsWith('.pdf') ? url : url + '.pdf';
    };



    const getViewableResumeUrl = (url) => {
        return url.endsWith('.pdf') ? url : url + '.pdf';
    }




    return (
        <div>
            <div className="inset-0  bg-black/50 fixed z-50 flex items-center justify-center"    >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative w-[90%] h-auto max-w-md bg-white rounded-lg p-3 ">

                    <button onClick={() => setResumeOpen(false)}
                        className=" right-2 top-2 absolute" >
                        <RxCross2 className="w-6 h-6 text-gray-500 hover:text-gray-600" />
                    </button>

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">{userData?.resume ? "Your Resume" : "Upload Resume"}</h2>

                    {/* has existing resume and resumeInputTrigger is false */}
                    {userData?.resume && !resumeInputTrigger && (
                        <div>
                            <div className="  p-2 rounded-md flex flex-col gap-2">

                                <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-md flex items-center gap-3">
                                    <FaFilePdf className="ml-4 w-8 h-8 text-emerald-400 " />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Resume on file</p>
                                        <p className="text-xs text-gray-500">PDF uploaded to cloud</p>
                                    </div>
                                </div>
                                <a href={getViewableResumeUrl(userData.resume)} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full">View current resume</a>
                                {console.log("Resume URL:", userData.resume)}
                                {/* <iframe
                                    src={getPdfUrl(userData.resume)}
                                    className="w-full rounded-md border border-emerald-200"
                                    style={{ height: '380px' }}
                                    title="Your Resume"
                                /> */}
                            </div>
                            <div className="pl-2 pr-2 gap-2 flex flex-col rounded-md ">
                                <button
                                    className="bg-emerald-500 hover:bg-emerald-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full mt-1"
                                    onClick={() => { setResumeInputTrigger(true) }}>
                                    Change resume
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full mt-1"
                                    onClick={() => setDeleteResumeModal(true)}>
                                    Delete resume
                                </button>
                                {deleteResumeModal && <DeleteResumeModal setDeleteResumeModal={setDeleteResumeModal} />}
                            </div>
                        </div>
                    )}

                    {/* user doest not have resume, show upload option(resumeInputTrigger-open) */}
                    {(!userData?.resume || resumeInputTrigger) && (
                        <div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className=" border-2 border-dotted border-emerald-400 pt-6 pb-6 mb-3 mx-1 rounded-md flex flex-col items-center  cursor-pointer">
                                <FaFileUpload className='w-6 h-6 mt-3 mb-2 text-emerald-400' />
                                <p className="text-sm font-medium mb-0">Click to select a PDF</p>
                                <p className="text-xs mb-2">Max file size:5MB</p>
                            </div>
                            {/* //now fileInputRef.current point to jsx element(input) in DOM (added this input to DOM via ref) */}
                            <input
                                ref={fileInputRef}
                                type="file" accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={HandleFileChange}
                            />
                            {selectedFile && (
                                <p className="text-sm text-emerald-600 mt-1 mb-2 ml-1 ">
                                    Selected: {selectedFile.name}
                                </p>
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
                            {/* div for Cancel and Upload button */}
                            <div className="flex gap-2 justify-end ">
                                {userData?.resume && (
                                    <button onClick={HandleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium px-3 py-1 rounded-md" disabled={loading}>
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={uploadResumeHandler}
                                    className="bg-emerald-500 mb-2 mt-1 hover:bg-emerald-600 text-sm font-medium text-white px-3 py-1 rounded-md"
                                    disabled={!selectedFile || loading}
                                >
                                    {loading ? "Uploading..." : userData?.resume ? "Update Resume" : "Upload Resume"}
                                </button>

                            </div>
                        </div>
                    )}

                </motion.div>

            </div>
        </div>
    );
}

export default UploadResume
