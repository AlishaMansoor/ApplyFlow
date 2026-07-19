import React, { useContext } from 'react'
import { lazy } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import JobDetails from './pages/JobDetail.jsx';
import Dashboard from './pages/Dashboard.jsx'
import { UserDataContext } from './context/UserContext.jsx'
import { SearchQueryContext } from './context/SearchContext.jsx'
import MyApplications from './pages/Myapplications.jsx'
import PostDetail from './pages/PostDetail.jsx'
import ApplicantDetail from './pages/ApplicantDetail.jsx'
import JobDetailsRecruiter from './pages/JobDetailRecruiter.jsx'
import Chats from './pages/ChatPage.jsx';
import Settings from './pages/Settings.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

const Profile = lazy(() => import('./pages/ProfilePage.jsx'));
const SavedApplication = lazy(() => import('./pages/SavedJobs.jsx'));

const App = () => {
  const { userData, loading } = React.useContext(UserDataContext);
  if (loading) return (
  <div className="flex items-center justify-center h-screen">
    <p className="text-gray-500">Loading...</p>
  </div>
);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Routes>
        /* Public Landing */
        <Route path="/" element={<LandingPage />} />

        /* Auth Routes (Not protected with isAuth) */
        <Route path='/signup' element={userData ? <Navigate to="/home" /> : <Signup />}></Route>
        <Route path='/login' element={userData ? <Navigate to="/home" /> : <Login />}></Route>
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Common protected — both userTypes */}
        <Route path='/home' element={userData ? <Home /> : <Navigate to="/login" />} />
        <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to="/login" />} />
        {/* <Route path='/dashboard' element={userData ? <Dashboard /> : <Navigate to="/login" />} /> */}
        <Route path='/conversations' element={userData? <Chats />:<Navigate to="/login" />} />
        <Route path='/settings' element={userData? <Settings />:<Navigate to="/home" />} />
        
        
        {/* Candidate only */}
        <Route path='/job/:id' element={userData?.userType === 'candidate' ? <JobDetails /> : <Navigate to="/home" />} />
        <Route path='/myapplications' element={userData?.userType === 'candidate' ? <MyApplications /> : <Navigate to="/home" />} />
        <Route path='/savedapplications' element={userData?.userType === 'candidate' ? <SavedApplication /> : <Navigate to="/home" />} />

        {/* Recruiter only */}
        <Route path='/applicant/:id' element={userData?.userType === 'recruiter' ? <ApplicantDetail /> : <Navigate to="/home" />} />
        <Route path='/job/recruiter/:id' element={userData?.userType === 'recruiter' ? <JobDetailsRecruiter /> : <Navigate to="/home" />}
        />
      </Routes>
    </>
  )
}

export default App


