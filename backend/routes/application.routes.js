import express from "express";
const applicationrouter=express.Router();

import {isAuth} from "../middlewares/authmiddleware.js";
import {uploadResume} from "../middlewares/upload.js";

import {applyToJob, getUserApplications, deleteApplication, getApplicantsForJob, updateApplicationStatus} from "../controllers/applycontrollers.js";




applicationrouter.get('/myapplications', isAuth, getUserApplications); 
applicationrouter.post('/applyjob',isAuth, uploadResume.single("resume"), applyToJob);
applicationrouter.delete('/delete/:applicationId', isAuth, deleteApplication); 


applicationrouter.get("/:jobId",isAuth, getApplicantsForJob);
// missing — update application status (recruiter accepts/rejects)
applicationrouter.put('/:applicationId', isAuth, updateApplicationStatus);

export default applicationrouter;