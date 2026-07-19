import User from '../models/Authmodels.js';
import Application from '../models/applicationmodel.js';
import Job from '../models/jobmodel.js';

export const getCurrentUser = async (req, res) => {
    try {
        let userid = req.user.userid;
        // console.log("User ID from token:", userid);
        if (!userid) {
            return res.status(401).json({ message: "Backend: usercontrollers.js , Unauthorized" });
        }
        let currUser = await User.findById(userid).select("-password");
        // console.log("User fetched from database:", currUser);
        if (!currUser) {
            return res.status(404).json({ message: "User not found" });
        }


        // console.log("Current user from token:", currUser);
        res.status(200).json({ message: "Current user fetched successfully", user: currUser });//sending user data to frontend after fetching from db

    } catch (e) {
        console.log("Error fetching current user:", e);
        res.status(500).json({ message: "Error fetching current user", error: e.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const updateData = {};
        updateData.firstName = req.body.firstName;
        updateData.lastName = req.body.lastName;
        updateData.userName = req.body.userName;
        updateData.headline = req.body.headline;
        updateData.location = req.body.location;
        updateData.industry = req.body.industry;
        updateData.companyWebsite = req.body.companyWebsite;

        // Parse JSON strings back to arrays
        if (req.body.skills) {
            updateData.skills = JSON.parse(req.body.skills);
        }
        if (req.body.education) {
            updateData.education = JSON.parse(req.body.education);
        }
        if (req.body.experience) {
            updateData.experience = JSON.parse(req.body.experience);
        }
        if (req.body.organization) {
            updateData.organization = JSON.parse(req.body.organization);
        }

        if (req.files?.profileImage?.[0]) {
            updateData.profileImage = req.files.profileImage[0].path;
        }
        if (req.files?.companyLogo?.[0]) {
            updateData.companyLogo = req.files.companyLogo[0].path;

        }






        const updatedUser = await User.findByIdAndUpdate(
            req.user.userid,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (e) {
        console.log("Error updating profile:", e);
        res.status(500).json({ message: "Error updating profile", error: e.message });
    }
}


export const updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }

        // Validate a user can rename malware.exe to resume.pdf. Checking req.file.mimetype is a second layer of actual content-type verification.
        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are allowed" });
        }
        let updatedUser = await User.findByIdAndUpdate(req.user.userid, { $set: { resume: req.file.path } }, { new: true, runValidators: true }).select("-password");
        // console.log("updateResume controller in usercontrollers: req.file:", req.file);
        res.status(200).json({ message: "Resume updated successfully", user: updatedUser });
    } catch (e) {
        console.log("Error updating resume:", e);
        res.status(500).json({ message: "Error updating resume", error: e.message });
    }
}

export const deleteResume = async (req, res) => {
    try {
        let updatedUser = await User.findByIdAndUpdate(req.user.userid, { $set: { resume: null } }, { new: true }).select("-password");
        res.status(200).json({ message: "Resume deleted successfully", user: updatedUser });
    } catch (e) {
        console.log("Error deleting resume:", e);
        res.status(500).json({ message: "Error deleting resume", error: e.message });
    }
}


export const saveApplication = async (req, res) => {
    try {
        // console.log("saveApplication route hit!");
        const userId = req.user.userid;
        const { jobId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({ message: "Job already saved" });
        }
        user.savedJobs.push(jobId);
        await user.save();
        res.status(200).json({ message: "Job saved successfully" });
    } catch (e) {
        console.log("Error saving job:", e);
        res.status(500).json({ message: "Error saving job", error: e.message });
    }
}



export const getSavedJobs = async (req, res) => {
    try {
        // console.log("getSavedJobs controller: Fetching saved jobs for user:", req.user.userid);
        const userId = req.user.userid;
        const user = await User.findById(userId).populate('savedJobs');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Saved Jobs fetched", savedJobs: user.savedJobs });
    } catch (e) {
        res.status(500).json({ message: "Error fetching saved jobs", error: e.message });
    }
}

export const deleteSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userid;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (!user.savedJobs.includes(jobId)) {
            return res.status(404).json({ message: "Job not found in saved list" });
        }


        await User.findByIdAndUpdate(
            userId,
            { $pull: { savedJobs: jobId } },
            { new: true }
        );

        res.status(200).json({ message: "Job removed from saved successfully" });
    } catch (e) {
        console.error("Error removing saved job:", e);
        res.status(500).json({ message: "Error removing saved job", error: e.message });
    }

};

//recruiter controllers

//to view other user's profile
export const getUserProfile = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (e) {
        console.error("Error viewing user profile:", e);
        res.status(500).json({ message: "Error viewing user profile", error: e.message });
    }
}


export const getUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const regex = new RegExp(q, 'i');
        if (!q) return res.status(200).json({ users: [] });

        const users = await User.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { userName: regex },
                { email: regex }
            ]
        }).select('firstName lastName userName profileImage headline')
            .limit(6); // max 6 results in dropdown 
        res.status(200).json({ users });
    } catch (e) {
        console.log("Backend Error in searching", e);
    }
}



