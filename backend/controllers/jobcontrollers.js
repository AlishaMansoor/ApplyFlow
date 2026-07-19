import Job from '../models/jobmodel.js';
import User from '../models/Authmodels.js'
import mongoose from 'mongoose';



export const getAllJobs = async (req, res) => {
    try {
        let alljobs = await Job.find().populate('postedBy', 'firstName lastName userName');
        res.status(200).json({ message: "Jobs fetched successfully", jobs: alljobs });
    } catch (e) {
        res.status(500).json({ message: "Error fetching jobs:backend", error: e });
    }
}


export const jobWithId = async (req, res) => {
    try {
        let id = req.params.id;
        let job = await Job.findById(id).populate('postedBy', 'firstName lastName userName');
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job found", job: job });
    } catch (e) {
        res.status(500).json({ message: "Error fetching job", error: e });
    }
}

//seeding dummy data for candidate dashboard
// export const seedjobs= async(req,res)=>{
//     try{


//         const dummyRecruiterId = new mongoose.Types.ObjectId(); // fake recruiter id

//         const dummyJobs = [
//             {
//                 title: "Frontend Developer",
//                 companyName: "Google",
//                 jobType: "Full-time",
//                 skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Redux"],
//                 experience: 1,
//                 location: "Bangalore",
//                 salaryRange: { min: 1200000, max: 1800000, currency: "INR" },
//                 description: "Build scalable and performant user interfaces for Google's core products. You will collaborate with designers and backend engineers to ship features used by millions of users worldwide.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "Fullstack Engineer",
//                 companyName: "Flipkart",
//                 jobType: "Full-time",
//                 skillsRequired: ["Node.js", "React", "MongoDB", "Express"],
//                 experience: 2,
//                 location: "Hyderabad",
//                 salaryRange: { min: 1000000, max: 1600000, currency: "INR" },
//                 description: "Join our platform team to build high-performance backend services and React-based dashboards. You will own features end-to-end from design to deployment.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "React Native Developer",
//                 companyName: "Swiggy",
//                 jobType: "Full-time",
//                 skillsRequired: ["React Native", "JavaScript", "REST APIs", "Firebase"],
//                 experience: 1,
//                 location: "Pune",
//                 salaryRange: { min: 900000, max: 1400000, currency: "INR" },
//                 description: "Work on Swiggy's consumer mobile app used by 10M+ users. You will be responsible for building smooth and responsive mobile experiences across Android and iOS.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "Backend Developer",
//                 companyName: "Razorpay",
//                 jobType: "Full-time",
//                 skillsRequired: ["Node.js", "PostgreSQL", "Redis", "Docker"],
//                 experience: 2,
//                 location: "Bangalore",
//                 salaryRange: { min: 1400000, max: 2000000, currency: "INR" },
//                 description: "Design and build robust payment APIs that handle millions of transactions daily. Strong understanding of system design, caching, and database optimization is expected.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "MERN Stack Developer",
//                 companyName: "Zoho",
//                 jobType: "Full-time",
//                 skillsRequired: ["MongoDB", "Express", "React", "Node.js"],
//                 experience: 0,
//                 location: "Chennai",
//                 salaryRange: { min: 700000, max: 1000000, currency: "INR" },
//                 description: "Freshers welcome. You will work closely with senior developers to build internal tools and customer-facing SaaS products. Great opportunity to learn at scale.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "Junior Frontend Developer",
//                 companyName: "Internshala",
//                 jobType: "Full-time",
//                 skillsRequired: ["React", "CSS", "JavaScript", "Git"],
//                 experience: 0,
//                 location: "Remote",
//                 salaryRange: { min: 500000, max: 800000, currency: "INR" },
//                 description: "Looking for a motivated fresher to join our frontend team. You will build landing pages, dashboards, and improve UI across the platform. Remote-first culture.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "Node.js Developer",
//                 companyName: "PhonePe",
//                 jobType: "Full-time",
//                 skillsRequired: ["Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
//                 experience: 1,
//                 location: "Bangalore",
//                 salaryRange: { min: 1100000, max: 1500000, currency: "INR" },
//                 description: "Build and maintain microservices powering PhonePe's payment and wallet systems. You will work in an agile environment with a strong focus on code quality and testing.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "Software Engineer - Fullstack",
//                 companyName: "Amazon",
//                 jobType: "Full-time",
//                 skillsRequired: ["Java", "React", "AWS", "SQL"],
//                 experience: 2,
//                 location: "Hyderabad",
//                 salaryRange: { min: 1800000, max: 2800000, currency: "INR" },
//                 description: "Work on Amazon's internal seller tools and logistics platforms. You will design, build and own features across the full stack in a fast-paced, high-ownership environment.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "React Developer - Contract",
//                 companyName: "Infosys",
//                 jobType: "Contract",
//                 skillsRequired: ["React", "Redux", "Axios", "Material UI"],
//                 experience: 1,
//                 location: "Mumbai",
//                 salaryRange: { min: 800000, max: 1200000, currency: "INR" },
//                 description: "6-month contract role to help migrate a legacy enterprise application to a modern React-based frontend. Strong component design and state management skills required.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//             {
//                 title: "DevOps + Fullstack Engineer",
//                 companyName: "Atlassian",
//                 jobType: "Remote",
//                 skillsRequired: ["Docker", "CI/CD", "Node.js", "React", "AWS"],
//                 experience: 2,
//                 location: "Remote",
//                 salaryRange: { min: 2000000, max: 3000000, currency: "INR" },
//                 description: "Rare hybrid role combining fullstack development with DevOps practices. You will build internal tooling and also manage deployment pipelines. Remote-first, global team.",
//                 status: "Open",
//                 postedBy: dummyRecruiterId,
//             },
//         ];
// console.log(dummyRecruiterId);
// console.log(dummyJobs);
//         await Job.deleteMany({ postedBy: dummyRecruiterId }); // avoid duplicates on re-seed
//         console.log("Old dummy jobs deleted");
//         const inserted = await Job.insertMany(dummyJobs);
// console.log(`${inserted.length} dummy jobs inserted`);
//         res.status(201).json({ message: `${inserted.length} dummy jobs seeded successfully` });

//     }catch(e){
//         res.status(500).json({message:  "Error seeding jobs", error: e });
//     }

// }

//candidate 
export const getTotalJobs = async (req, res) => {
    try {
        const { userName } = req.params;
        //finding user by userName first;
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(500).json({ message: "no user found." });
        }
        const totalJobs = await Job.find({ postedBy: user._id }).sort({ createdAt: -1 }).limit(8);
        res.status(200).json({ totalJobs });
    } catch (e) {
        console.error("Backend error fetching jobs for profile page:", e.message);
        res.status(500).json({ message: "Error fetching jobs" });
    }
}





//recruiter's
export const getMyJobs = async (req, res) => {
    try {
        const userId = req.user.userid;
        const jobs = await Job.aggregate([
            // only this recruiter's jobs, Filters documents — like a WHERE clause in SQL:
            { $match: { postedBy: new mongoose.Types.ObjectId(userId) } },

            // join applications collection — count per job, Joins another collection — like SQL JOIN
            {
                $lookup: {
                    from: "applications",   // must match exact MongoDB collection name
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applications"
                }
            },

            // add applicantsCount(new) field
            {
                $addFields: {
                    applicantsCount: { $size: "$applications" }
                }
            },

            // remove full applications array — only keep the count
            // Controls which fields to include or exclude — like SELECT in SQL
            { $project: { applications: 0 } },

            { $sort: { createdAt: -1 } }
        ]);
        if (!jobs) {
            return res.status(404).json({ message: "No jobs found for this recruiter" });
        }
        res.status(200).json({ message: "Jobs fetched successfully", jobs });
    } catch (e) {
        console.error("Error fetching recruiter jobs:", e);
        res.status(500).json({ message: "Error fetching jobs", error: e.message });
    }
}




export const postJob = async (req, res) => {

    const validateJobposting = (title, companyName, jobType, skillsRequired, experience, salaryRange, location, description, status) => {
        if (!title.trim()) { return "Job title is mandatory"; }
        if (!companyName.trim()) { return "Organization name is mandatory"; }
        if (!jobType.trim()) { return "Job type is mandatory"; }
        // arrives as array from frontend ["React", "Node.js"] — no JSON.parse needed
        if (!skillsRequired || !Array.isArray(skillsRequired) || skillsRequired.length === 0) {
            return "At least one skill is required";
        }
        const filteredSkills = skillsRequired.map(skill => skill?.trim()).filter(Boolean);
        if (filteredSkills.length === 0) {
            return "At least one valid skill is required";
        }
        const expNum = Number(experience);
        if (experience === undefined || experience === null || experience === "" || isNaN(expNum) || expNum < 0 || expNum > 20) {
            return "Experience must be a number between 0 and 20";
        }
        // arrives as object { min, max, currency } — no JSON.parse needed
        if (!salaryRange || typeof salaryRange !== 'object') {
            return "Salary range must be a valid object";
        }

        
        const minVal = Number(salaryRange.min);
        const maxVal = Number(salaryRange.max);


        if (
            salaryRange.min === undefined || salaryRange.min === null || salaryRange.min === "" ||
            salaryRange.max === undefined || salaryRange.max === null || salaryRange.max === "" ||
            isNaN(minVal) || isNaN(maxVal) ||
            minVal < 0 || maxVal < 0 ||
            minVal > maxVal
        ) {
            return "Salary range must be a valid object with positive min and max values, where min is less than or equal to max";
        }
        if (!location.trim()) { return "Location is mandatory"; }
        if (!description.trim()) { return "Description is mandatory"; }
        if (description.trim() && typeof description.trim() !== 'string') {
            return "Provide Job Description ";
        }
        if (status && !["Open", "Closed"].includes(status)) {
            return "Status must be either 'Open' or 'Closed'";
        }
        return true; // no validation errors 
    }
    try {
        const recruiterId = req.user.userid;
        const { title,
            companyName,
            jobType,
            description,
            location,
            skillsRequired,
            salaryRange,
            status,
            experience } = req.body;
        // console.log(jobType);
        const validationError = validateJobposting(title, companyName, jobType, skillsRequired, experience, salaryRange, location, description, status);
        if (validationError !== true) {
            return res.status(400).json({ message: validationError });
        }
        const newJob = await Job.create({
            postedBy: recruiterId,
            title,
            companyName,
            location,
            jobType,
            description,
            skillsRequired,  // pass the array directly — Mongoose handles array schema
            salaryRange,  // pass the object directly — Mongoose handles nested schema
            status,
            experience,

        });
        res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (e) {
        res.status(500).json({ message: "Error posting job", error: e.message });
    }
}



export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        //    console.log("Deleting job with id:", jobId);

        const job = await Job.findOneAndDelete({ _id: jobId });
        //    console.log("Deleted job:", job); 

        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json({ message: "job deleted successfully" });

    } catch (e) {
        console.error("Delete job error", e);
        res.status(500).json({ message: "Backend error deleting job.", error: e.message })
    }
}




export const updateJob = async (req, res) => {
    try {
        // 1. Place this inside your updateJob controller to inspect the incoming data
console.log("---------------- DEBUG START ----------------");

        const { jobId } = req.params;
        const { experience, status, jobType, description } = req.body;
console.log("Logged-in req.user object:", req.user); 

    
        const cleanJobType = typeof jobType === 'string' ? jobType.trim() : '';
        const cleanStatus = typeof status === 'string' ? status.trim() : '';
        const cleanDescription = typeof description === 'string' ? description.trim() : '';

        if (!cleanJobType) return res.status(400).json({ message: "Job type is required" });
        if (!cleanStatus) return res.status(400).json({ message: "Status is required" });
        if (!cleanDescription) return res.status(400).json({ message: "Description is required" });

        
        const expNum = Number(experience);
        if (experience === undefined || experience === null || experience === "" || isNaN(expNum)) {
            return res.status(400).json({ message: "Experience must be a valid number" });
        }

        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" }); // Added missing "return" and updated to 404
        }

        console.log("job.postedBy value:", job.postedBy);

        if (job.postedBy.toString() !== req.user.userid.toString()) {
            return res.status(403).json({ message: "Unauthorized — you can only update your own jobs" });
        }

        
        const difference = Math.abs(expNum - Number(job.experience));
        if (isNaN(difference) || difference > 1) {
            return res.status(400).json({ message: "Experience can only be updated by one unit at a time" });
        }

       
        if (!["Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship"].includes(cleanJobType)) {
            return res.status(400).json({ message: "Invalid job type" });
        }
        if (!["Open", "Closed"].includes(cleanStatus)) {
            return res.status(400).json({ message: "Status must be Open or Closed" });
        }

       
        const updatedJob = await Job.findByIdAndUpdate(
            jobId, 
            { experience: expNum, status: cleanStatus, jobType: cleanJobType, description: cleanDescription }, 
            { new: true }
        ); 

        return res.status(200).json({ message: "Job updated successfully", job: updatedJob });
console.log("----------------- DEBUG END -----------------");
    } catch (e) {
        console.error("Error updating job:", e.message);
        return res.status(500).json({ message: "Backend error updating job", error: e.message });
    }
}