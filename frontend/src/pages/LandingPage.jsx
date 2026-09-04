import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiSocketdotio, SiTailwindcss } from 'react-icons/si';
import { FaStar } from "react-icons/fa6";
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext.jsx';
import { UserDataContext } from '../context/UserContext.jsx';
import Carousel from '../components/ui/Carousel.jsx';
import DemoLoginModal from '../components/ui/DemoLoginModal.jsx';

import democandidateownprofile from '../assets/democandidateownprofile.png';
import democandidateapplications from '../assets/democandidateapplications.png';
import democandidateeditprofile from '../assets/democandidateeditprofile.png';
import democandidatehome from '../assets/democandidatehome.png';
import democandidateinterviewprep from '../assets/democandidateinterviewprep.png';
import democandidateinterviewprepquestions from '../assets/democandidateinterviewprepquestions.png';
import democandidatepeoplesearch from '../assets/democandidatepeoplesearch.png';
import democandidaterequestsent from '../assets/democandidaterequestsent.png';
import democandidateresume from '../assets/democandidateresume.png';

import demorecruiteracceprejectapplication from '../assets/demorecruiteracceprejectapplication.png';
import demorecruiterapplicantsforjob from '../assets/demorecruiterapplicantsforjob.png';
import demorecruiterchat from '../assets/demorecruiterchat.png';
import demorecruiterinvitetoapply from '../assets/demorecruiterinvitetoapply.png';
import demorecruiternotifications from '../assets/demorecruiternotifications.png';
import demorecruiterpostjob from '../assets/demorecruiterpostjob.png';
import demorecruiterupdatejob from '../assets/demorecruiterupdatejob.png';
import demorecruitervirginhome from '../assets/demorecruitervirginhome.png';

const candidateScreenshots = [
    democandidatehome,
    democandidateresume,
    democandidateapplications,
    democandidateownprofile,
    democandidateeditprofile,
    democandidateinterviewprep,
    democandidateinterviewprepquestions,
    democandidatepeoplesearch,
    democandidaterequestsent
]

const recruiterScreenshots = [
    demorecruitervirginhome,
    demorecruiternotifications,
    demorecruiterpostjob,
    demorecruiterapplicantsforjob,
    demorecruiterinvitetoapply,
    demorecruiteracceprejectapplication,
    demorecruiterupdatejob,
    demorecruiterchat,

];

const techStack = [
    { icon: SiReact, name: 'React' },
    { icon: SiNodedotjs, name: 'Node.js' },
    { icon: SiExpress, name: 'Express' },
    { icon: SiMongodb, name: 'MongoDB' },
    { icon: SiSocketdotio, name: 'Socket.io' },
    { icon: SiTailwindcss, name: 'Tailwind CSS' },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const { serverUrl } = React.useContext(AuthDataContext);
    const { userData, setUserData } = React.useContext(UserDataContext);
    const [demoType, setDemoType] = React.useState(null);



    return (
        <div className="w-full bg-white">
            {demoType && (
                <DemoLoginModal demoType={demoType} setDemoModal={setDemoType} />

            )}
            {/* Navbar */}
            <div className="w-full fixed h-[72px] bg-[#f2f1f1] flex items-center justify-between px-6 md:px-10 top-0 z-40 shadow-md">
                <div className="flex items-center gap-2">
                    <LuBriefcaseBusiness className="text-emerald-600 w-6 h-6" />
                    <span className="font-bold text-xl text-slate-800">
                        Apply<span className="text-emerald-600">Flow</span>
                    </span>
                </div>
                <div className="flex items-center bg-emerald-600 rounded-lg p-3 font-medium text-slate-50 gap-2 hover:bg-emerald-700 transition-colors">
                    <button
                        onClick={() => navigate('/login')}
                        className="hover:underline hover:decoration-slate-50 "
                    >
                        Login /
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="hover:underline hover:decoration-slate-50"
                    >
                        Sign up
                    </button>
                </div>
            </div>



            {/* Hero section */}
            <section className="min-h-screen flex flex-col items-center justify-start px-6 pt-[80px] text-center bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex items-center gap-2 mt-28 mb-4">
                    <LuBriefcaseBusiness className="text-emerald-600 w-8 h-8" />
                    <span className="font-bold text-3xl text-slate-800">
                        Apply<span className="text-emerald-600">Flow</span>
                    </span>
                </div>

                <h1 className="text-3xl mt-3 md:text-5xl font-bold text-slate-800 max-w-2xl leading-tight">
                    Where great talent meets the right opportunity
                </h1>
                <p className="text-gray-500 mt-6 max-w-xl text-base md:text-lg">
                    Whether you&apos;re hunting for your next role or looking to hire top technicaltalent, ApplyFlow keeps your workflow organized without the bloat—featuring real-time application updates, direct messaging, and transparent status tracking.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 mt-12">
                    <button
                        onClick={() => setDemoType('candidate')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 disabled:opacity-60"
                    >
                        Explore as Candidate
                    </button>
                    <button
                        onClick={() => setDemoType('recruiter')}
                        className="bg-white border-2 border-emerald-600 text-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 disabled:opacity-60"
                    >
                        Explore as Recruiter
                    </button>
                </div>
            </section>


            {/* Candidate carousel */}
            <section className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center px-6 py-16">
                <p className="text-emerald-600 font-medium mb-2">For Candidates</p>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 text-center">
                    Find and apply to jobs that fit you
                </h2>

                <p className="text-slate-600 max-w-2xl text-center mb-6 text-sm md:text-base leading-relaxed">
                    Track your application pipeline, prepare for interviews, and connect directly with recruiters without losing context.
                </p>

                {/* Feature Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm">
                        Application Tracking
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm">
                        Interview Prep Hub
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm">
                        People Search & Networking
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm">
                        Direct Messaging
                    </span>
                </div>

                <Carousel images={candidateScreenshots} altPrefix="Candidate" />
            </section>

            {/* Recruiter carousel */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-slate-50">
                <p className="text-emerald-600 font-medium mb-2">For Recruiters</p>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 text-center">
                    Post jobs and manage applicants with ease
                </h2>

                <p className="text-slate-600 max-w-2xl text-center mb-6 text-sm md:text-base leading-relaxed">
                    Review incoming candidate pools, send direct application invites, and keep candidate interactions organized in one clean interface.
                </p>

                {/* Feature Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl">
                    <span className="px-0 py-1 bg-slate-50 text-slate-700 text-xs font-semibold  ">
                        Job Management
                    </span>
                    <span  ><FaStar className="text-yellow-500 w-3 h-3" /></span>
                    <span className="px-0 py-1 bg-slate-50 text-slate-700 text-xs font-semibold ">
                        Applicant Review
                    </span>
                    <span  ><FaStar className="text-yellow-500 w-3 h-3" /></span>
                    <span className="px-0 py-1 bg-slate-50 text-slate-700 text-xs font-semibold ">
                        Direct Candidate Invites
                    </span>
                    <span  ><FaStar className="text-yellow-500 w-3 h-3" /></span>
                    <span className="px-0 py-1 bg-slate-50 text-slate-700 text-xs font-semibold ">
                        Real-Time Messaging
                    </span>
                </div>

                <Carousel images={recruiterScreenshots} altPrefix="Recruiter" />
            </section>


            {/* Tech stack — portfolio mode only */}

            <section className="py-16 mb-20 mt-14 px-6 flex flex-col items-center border-t border-gray-100">
                <h3 className="text-lg font-semibold lg:font-bold text-slate-700 mb-8">Built with</h3>
                <div className="flex flex-wrap justify-center gap-10">
                    {techStack.map(({ icon: Icon, name }) => (
                        <div key={name} className="flex flex-col items-center gap-3 lg:gap-6 text-gray-600">
                            <Icon className="w-10 h-10 lg:w-12 lg:h-12" />
                            <span className="text-sm lg:text-base">{name}</span>
                        </div>
                    ))}
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-slate-800 text-slate-300 py-10 px-6">
                {/* Top Section */}
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2">
                        <LuBriefcaseBusiness className="text-emerald-500 w-5 h-5" />
                        <span className="font-semibold text-white">ApplyFlow</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <a href="/terms" className="hover:text-white">Terms</a>
                        <a href="/privacy" className="hover:text-white">Privacy Policy</a>


                    </div>
                </div>

                {/* Divider Line & Bottom Section */}
                <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-slate-700 flex flex-col items-center gap-3 text-xs text-slate-400 text-center">
                    <p>© {new Date().getFullYear()} ApplyFlow. All rights reserved.</p>
                    <p>Made with ❤️ by Alisha Mansoor.</p>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/your-username/applyflow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white"
                        >
                            <FaGithub className="w-5 h-5" />
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com/in/your-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white"
                        >
                            <FaLinkedin className="w-5 h-5" />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </footer>




        </div>
    )
}

export default LandingPage
