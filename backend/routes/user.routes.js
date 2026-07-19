import express from 'express';
const userrouter=express.Router();
import {isAuth} from '../middlewares/authmiddleware.js';
import {updateProfileFields, uploadResume } from '../middlewares/upload.js';

import {getCurrentUser, updateResume, updateProfile, deleteResume, saveApplication, deleteSavedJob, getSavedJobs, getUserProfile, getUsers} from '../controllers/usercontrollers.js';

// import { getTotalJobs } from '../controllers/jobcontrollers.js';

import { getApplicantsForJob } from '../controllers/applycontrollers.js';


//common route
userrouter.get('/search', isAuth, getUsers);
//Candidate's routes
userrouter.get('/currentuser', isAuth, getCurrentUser);
userrouter.get('/getprofile/:userName', isAuth, getUserProfile); // to view other user's profile
userrouter.put("/updateprofile",isAuth,updateProfileFields,updateProfile);
userrouter.put("/updateresume",isAuth,uploadResume.single("resume"),updateResume);
userrouter.delete("/deleteresume",isAuth, deleteResume);

userrouter.post("/save",isAuth, saveApplication);
userrouter.get('/savedjobs', isAuth, getSavedJobs);
userrouter.delete('/deletesavedjob/:jobId', isAuth, deleteSavedJob);

//Recruiter's routes



export default userrouter;