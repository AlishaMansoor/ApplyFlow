import express from 'express';
const airouter= express.Router();
import { isAuth } from '../middlewares/authmiddleware.js';
import { interviewPrep } from '../controllers/aicontrollers.js';

airouter.post('/interview-prep',isAuth, interviewPrep);


export default airouter;