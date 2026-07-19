import express from 'express';
const authrouter=express.Router();

import {signup,login,logout, forgotPassword, resetPassword} from '../controllers/authcontrollers.js';

authrouter.post('/signup',signup);
authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.post('/forgot-password', forgotPassword);
authrouter.put('/reset-password/:token', resetPassword);
export default authrouter;