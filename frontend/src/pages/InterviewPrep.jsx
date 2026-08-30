import React from 'react'
import { UserDataContext } from '../context/UserContext.jsx'
import { AuthDataContext } from '../context/AuthContext.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import UploadResume from '../components/ui/UploadResume.jsx'
import { RiSparklingLine } from "react-icons/ri";
import { FaFilePdf } from 'react-icons/fa'
import axios from 'axios';
import QuestionAccordian from '../components/ui/QuestionAccordian.jsx'
import { motion, AnimatePresence } from 'framer-motion';


const aiLoadingMessages = [
    "Reading and parsing your uploaded resume...",
    "Analyzing your core skills and project experience...",
    "Crafting tailored interview questions...",
    "Generating detailed answers and code examples...",
    "Finalizing your personalized prep session..."
];


const InterviewPrep = () => {
    const { serverUrl } = React.useContext(AuthDataContext);
    const { userData } = React.useContext(UserDataContext);

    const [resumeOpen, setResumeOpen] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("");

    const [level, setLevel] = React.useState("easy"); //warm-up/easy/intermediate/advanced
    const [type, setType] = React.useState(["technical"]); //technical/behavioral
    const [qcount, setQcount] = React.useState("10"); //10/20/30/50

    // const [loadingResponse, setLoadingResponse] = React.useState(false);
    const [AiResponse, setAiResponse] = React.useState([]);
    const [controller, setController] = React.useState(null);

    const [loadingMsgIndex, setLoadingMsgIndex] = React.useState(0);
    React.useEffect(() => {
        if (!loading) {
            setLoadingMsgIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setLoadingMsgIndex((prev) => (prev + 1) % aiLoadingMessages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [loading]);

    let isResumeAbsent;
    if (!userData.resume) {
        isResumeAbsent = true;
    } else {
        isResumeAbsent = false;
    }
    const getViewableResumeUrl = (url) => {
        return url.endsWith('.pdf') ? url : url + '.pdf';
    }

    const toggleType = (t) => {
        setType((prev) =>
            prev.includes(t)
                ? prev.filter((a) => a !== t)
                : [...prev, t]
        );
    }


    const validate = () => {
        if (!level || type.length === 0 || !qcount) {
            setError("Select Atleast one level, type & question-count.");
            return false;
        }
        return true;
    }


    const handleGenerateClick = async () => {
        setError("");
        if (!validate()) return;

        const newController = new AbortController();
        setController(newController);
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/ai/interview-prep`, { level, type, qcount, resumeUrl: userData.resume }, { withCredentials: true, signal: newController.signal });
            setAiResponse(result.data.aiResponse);

        } catch (e) {
            // Ignore errors caused by user cancelling the request
            if (axios.isCancel(e)) {
                console.log("Request cancelled by user.");
                setError("Question generation cancelled.");
            } else {
                setError(e.response?.data?.message || "Failed to generate questions.");
                console.error(e.response?.data?.message || "Some error occured in generating questions.")
            }

        } finally {
            setLoading(false);
            setController(null);
        }
    }

    const handleCancel = () => {
        if (controller) {
            controller.abort(); // Cancel the active HTTP request
            setLoading(false);
            setController(null);
        }
    };

    React.useEffect(() => {
    return () => {
        if (controller) {
            controller.abort();
        }
    };
}, [controller]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-slate-50">

            {resumeOpen && (<UploadResume setResumeOpen={setResumeOpen} />)}

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

            {/* Main content div */}
            <div className="mt-[80px] w-full min-h-[calc(100vh-80px)] lg:pl-[280px] bg-slate-50 flex flex-col items-center justify-start lg:items-start py-4">
                <div className="bg-slate-50 w-[100%] md:max-w-2xl lg:max-w-3xl py-4 px-6 flex flex-col items-start justify-start ">
                    <h2 className=" text-gray-700 text-xl font-medium">Interview Prep</h2>
                    <p className=" text-gray-500 text-xs italic">Prepare for you Interviews with ApplyFlow.</p>
                    {isResumeAbsent ?
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 mt-2 flex items-center justify-between w-full">
                            <div>
                                <p className="text-sm font-medium text-amber-700">Add resume for interview-prep.</p>
                                <p className="text-xs text-amber-600 mt-1">You can generate interview questions based on your preferences.</p>
                            </div>
                            <button
                                onClick={() => setResumeOpen(true)}
                                className="bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-600"
                            >
                                Add Resume
                            </button>
                        </div>
                        :
                        <div className="bg-slate-50 p-2 w-full rounded-md flex flex-col gap-2">

                            <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-md flex items-center gap-3">
                                <FaFilePdf className="ml-4 w-8 h-8 text-emerald-400 " />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Resume on file</p>
                                    <p className="text-xs text-gray-500">Your Uploaded Resume PDF</p>
                                </div>
                            </div>
                            <a href={getViewableResumeUrl(userData.resume)} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-center p-2 text-sm font-medium text-white  rounded-md w-full">View current resume</a>


                        </div>
                    }

                    {!isResumeAbsent &&
                        <>
                            <div className="w-full bg-slate-50 px-3 py-4 border border-gray-300 rounded-2xl mx-1 my-4 flex flex-col items-start justify-start gap-0">
                                <h3 className="text-gray-500 font-medium text-md mb-3">Select Your Preferences below:</h3>
                                <div className="flex flex-wrap my-2 gap-2">
                                    
                                    <label className=" flex items-center text-center text-sm font-medium text-gray-700">Level : </label>
                                    {['Warm-Up', 'Easy', 'Intermediate', 'Advanced'].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLevel(l.toLowerCase())}
                                            className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${level === l.toLowerCase()
                                                ? 'bg-emerald-500 text-white border-emerald-500'      // active
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400'  // inactive
                                                }`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap my-2 gap-3" >
                                    <label className="flex items-center text-center text-sm font-medium text-gray-700">Type : </label>
                                    {['Technical', 'Behavioral', 'Project', 'Situational'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => toggleType(t.toLowerCase())}
                                            className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${type.includes(t.toLowerCase())
                                                ? 'bg-emerald-500 text-white border-emerald-500'      // active
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400'  // inactive
                                                }`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap my-2 gap-3">
                                    <label className="flex items-center text-center text-sm font-medium text-gray-700">Question Count :</label>
                                    {['10', '20', '30'].map((c) => (
                                        <button key={c} onClick={() => setQcount(c.toLowerCase())} className={`px-4 py-1 rounded-full text-sm font-medium border transition-all ${qcount === c.toLowerCase()
                                            ? 'bg-emerald-500 text-white border-emerald-500'      // active
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400'  // inactive
                                            }`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={loading}
                                    onClick={handleGenerateClick}
                                    className={`px-4 py-1 rounded-md text-md font-medium border-2 mt-2 border-gray-300 text-gray-700 hover:cursor-pointer hover:border-emerald-300`}>
                                    {loading ?<>Generating...<RiSparklingLine className="text-yellow-500 text-lg font-medium inline" /></> : "Generate"}
                                </button>
                                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                                {success && <p className="text-sm text-emerald-700 mt-2">{success}</p>}

                                {loading && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 mt-3 rounded-md text-sm font-medium border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                                    >
                                        Cancel 
                                    </button>
                                )}
                            </div>
                            {loading && (
                                <div className="w-full  border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 my-4">
                                    <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />

                                    <div className="h-6 flex items-center justify-center overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.p
                                                key={loadingMsgIndex}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-xs font-medium text-emerald-700 text-center"
                                            >
                                                {aiLoadingMessages[loadingMsgIndex]}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                            {/* Response Accordion Output */}
                            {!loading && AiResponse.length > 0 && (
                                <div className="w-full flex flex-col py-8 mt-4 rounded-2xl  px-2 bg-slate-50 border border-gray-300  min-h-[200px]">
                                    {AiResponse.map((item, index) => (
                                        <QuestionAccordian key={index} item={item} index={index} />
                                    ))}
                                </div>
                            )}

                        </>
                    }
                </div>
            </div>

        </div >
    )
}

export default InterviewPrep
