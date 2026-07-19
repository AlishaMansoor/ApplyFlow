import express from 'express';
const jobrouter=express.Router();
import { getAllJobs, jobWithId, postJob, updateJob, deleteJob, getTotalJobs, getMyJobs} from '../controllers/jobcontrollers.js';
import { getApplicantsForJob } from '../controllers/applycontrollers.js';
import {isAuth} from '../middlewares/authmiddleware.js';
// import {seedjobs} from '../controllers/jobcontrollers.js';


jobrouter.get('/alljobs', isAuth, getAllJobs);
jobrouter.get('/getjob/:id', isAuth, jobWithId);
// jobrouter.get('/seed', seedjobs);

jobrouter.post('/createjob', isAuth, postJob);
jobrouter.get('/getmyjobs', isAuth, getMyJobs)
jobrouter.get("/gettotaljobs/:userName",isAuth, getTotalJobs);
jobrouter.put("/:jobId",isAuth, updateJob);
jobrouter.delete("/:jobId",isAuth, deleteJob);
export default jobrouter;