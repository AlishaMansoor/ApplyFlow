import Application from "../models/applicationmodel.js"
import User from "../models/Authmodels.js";
import Job from "../models/jobmodel.js";
import { createNotification } from "./notificationcontrollers.js";


export const getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user.userid }).populate('jobId', 'title companyName location jobType salaryRange description status skillsRequired').sort({updatedAt: -1});
        res.status(200).json({ message: "Applications fetched", applications });
    } catch (e) {
        res.status(500).json({ message: "Error fetching applications" });
    }
}

export const applyToJob = async (req, res) => {
    try {
        const jobId = req.body.jobId;
        const candidateId = req.user.userid;
        // resume comes either as uploaded file(cloudinary) OR as existing profile URL
        //  uploadResume.single("resume") is fine for when user uploads a new file, but when they use their profile resume URL, multer will find no file and req.file will be undefined, so req.body.resume 
        const resume = req.file?.path || req.body.resume;
        if (!resume) {
            return res.status(400).json({ message: "No resume provided" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const existingApplication = await Application.findOne({
            jobId,
            candidateId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You already applied for this job"
            });
        }
        const newApplication = Application.create({
            jobId: jobId,
            candidateId: candidateId,
            resume: resume
        });

        // await newApplication.save();, since create() already saves the document
        res.status(201).json({ message: "Applied successfully", application: newApplication });
    } catch (e) {
        console.log("Backend error while applying to job", e)
        res.status(500).json({ message: "Error applying the job" });
    }
}

export const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const candidateId = req.user.userid;
        const application = await Application.findById(applicationId);
        if (!application) {
            console.log("Application not found")
            return status(404).json({ message: "Application not found to delete" })
        }
        if (application.candidateId.toString() !== candidateId.toString()) {
            return res.status(403).json({ message: "Unauthrized to delete the application!" })
        }
        await Application.findByIdAndDelete(application);
        res.status(200).json({ message: "Application Withdrawn successfully!" })

    } catch (e) {
        console.error("Error withdrawing application:", e);
        res.status(500).json({ message: "Error withdrawing application", error: e.message });
    }
}

//recruiter route
export const getApplicantsForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const recruiterId = req.user.userid;
        // console.log("applycontrollers, getApplicationsForJob controller:Fetching applicants for jobId:", jobId, "by recruiterId:", recruiterId);

        //verify this job belongs to the current user/recruiter.
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job Not Found" });
        }
        // console.log("Job found for fetching applicants:", job);
        if (job.postedBy.toString() !== recruiterId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const applicants = await Application.find({ jobId }).populate('candidateId', 'firstName lastName userName headline profileImage skills resume').sort({ createdAt: -1 })
        res.status(200).json({ message: "Applicants fetched successfully", applicants })
    } catch (e) {
        console.error("Error fetching applicants:", e);
        res.status(500).json({ message: "Error fetching applicants", error: e.message });
    }
}

export const updateApplicationStatus = async (req, res) => {

    // i am not checking the updater is recruiter or candidate
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const recruiterId = req.user.userid;

        


        if (!status || !["Applied", "Under Review", "Rejected", "Accepted"].includes(status)) {
            return res.status(400).json({ message: "Valid status is required" });
        }
       
        const application = await Application.findById(applicationId).populate('jobId'); //without specifying any selected fields, Mongoose populates the entire Job document (the whole object) inside jobId
        
        const notificationType = "application-update";
        const message = `Your application for ${application.jobId.title} at ${application.jobId.companyName} has been ${status.toLowerCase()}`;


        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.jobId.postedBy.toString() !== recruiterId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this application status" });
        }
        if (application.status === "Accepted" && status === "Rejected") {
            return res.status(400).json({ message: "Cannot change status once accepted" });
        }
        if (application.status === "Rejected" && status === "Accepted") {
            return res.status(400).json({ message: "Cannot change status once rejected" });
        }
        if (application.status === status) {
            return res.status(400).json({ message: `Application already ${status}` });
        }


        application.status = status;
        await application.save();

        //Creating Notification
        await createNotification({
            senderId: recruiterId,
            receiverId: application.candidateId,
            type: notificationType,
            message: message
        });

        console.log("Notification created: ");

        res.status(200).json({ message: "Application status updated successfully", application });
    } catch (e) {
        console.error("Backend Error updating application status:", e);
        res.status(500).json({ message: "BackendError updating application status", error: e.message });
    }
}