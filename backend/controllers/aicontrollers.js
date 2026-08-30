import pdfParse from 'pdf-parse-fork';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import User from '../models/Authmodels.js';
import NodeCache from 'node-cache';
import crypto from 'crypto';

const aiCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

const AI = new GoogleGenerativeAI(process.env.AI_API_KEY);

export const interviewPrep = async (req, res) => {
    try {
        const { level, type, qcount, resumeUrl } = req.body;
        const user = await User.findById(req.user.userid);
        const now = new Date();
        const lastReset = new Date(user.aiGenerations.lastReset);

        const hoursPassed = (now - lastReset) / (1000 * 60 * 60);
        if (!resumeUrl) {
            return res.status(400).json({ message: "No resume found. Upload a resume first." });
        }
        if (!level || !type || !qcount) {
            return res.status(400).json({ message: "Please specify your requirements, such as level,type and no. of questions." });
        }
        if (hoursPassed >= 24) {
            // Reset count for a new 24-hour window
            user.aiGenerations.count = 0;
            user.aiGenerations.lastReset = now;
        }
        if (user.aiGenerations.count >= 3) {
            return res.status(429).json({
                message: "Daily limit reached. You can only generate interview questions 3 times per day."
            });
        }

        // generating a unique cache key based on inputs
        const sortedTypes = Array.isArray(type) ? [...type].sort().join(',') : type;
        const cacheKey = crypto
            .createHash('md5')
            .update(`${req.user._id}-${resumeUrl}-${level}-${sortedTypes}-${qcount}`)
            .digest('hex');

        // checking if cached response exists
        const cachedResponse = aiCache.get(cacheKey);
        if (cachedResponse) {
            // console.log("Returned from cache.")
            return res.status(200).json({
                success: true,
                aiResponse: cachedResponse,
                cached: true
            });
        }

        //fetching text from pdf
        const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data);
        const pdfData = await pdfParse(pdfBuffer);
        // console.log("pdf parsed!");  
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Could not extract text from resume. Make sure it's not a scanned image." });
        }

        //calling gemini
        const model = AI.getGenerativeModel({
            model: "gemini-3.6-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const typeString = Array.isArray(type) ? type.join(', ') : type;

        const prompt = `You are a strict technical recruiter and document classifier.

Step 1: Analyze the text provided below. 
Determine if this document is a valid resume/CV. 
- A valid resume contains structured sections like Professional summary, certificates, acheivements, Work Experience, Skills, Projects, or Education.
- If the document contains letter greetings like "Dear Hiring Manager", formal closing statements, letter paragraphs, or cover letter structure), OR if it is not a resume, DO NOT generate interview questions.

Step 2: Respond based on your classification in STRICT JSON format:

If it is NOT a valid resume (e.g., it is a cover letter):
Return ONLY this JSON:
{
  "error": "The uploaded document appears to be a cover letter or non-resume file. Please upload a valid resume to generate interview questions."
}

If it IS a valid resume:
Generate exactly ${qcount} interview questions and precise answers based on the candidate's skills and experience.
Return ONLY a JSON array formatted like this:
[
  {
    "question": "1. [${typeString}] Describe your experience with Node.js...",
    "answer": "In my previous role..."
  }
]

Requirements for questions:
- Difficulty level: ${level}
- Question types to include: ${typeString}
- Total questions: ${qcount}

Document Text:
${resumeText}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);

        if (parsedData.error) {
            return res.status(400).json({
                success: false,
                message: parsedData.error
            });
        }

        aiCache.set(cacheKey, parsedData);

        user.aiGenerations.count += 1;
        await user.save();
        return res.status(200).json({ success: true, aiResponse: parsedData });

    } catch (e) {
        console.error("Error in interviewPrep controller:", e.message);
        return res.status(500).json({ message: e.message || "Failed to generate interview questions." });
    }
}