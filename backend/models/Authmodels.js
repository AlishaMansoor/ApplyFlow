import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },

    userType: {
        type: String,
        enum: ["candidate", "recruiter"],
        default: "candidate",
    },
    profileImage: {
        type: String,
        default: "",
    },
    headline: {
        type: String,
        default: "",
    },
    skills: [{
        type: String
    }],
    education: [{
        college: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startYear: Number,
        endYear: Number,
    },],
    location: {
        type: String,
        default: "",
    },
    experience: [{
        title: { type: String },
        company: { type: String },
        description: { type: String },
        startDate: Date,
        endDate: Date,
    },],
    resume: {
        type: String, // Cloudinary URL
        default: "",
    },

    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],
    // For recruiters

    organization: {
        organizationName: {
            type: String,
            default: "",
            trim: true,
        },
        organizationSize: {
            type: String,
            default: undefined,  // no default — field simply won't exist until recruiter fills it
            trim: true,
            enum: ["", "1-50", "51-200", "201-500", "501-1000", "1001-10000", "10001+"]
        },
        organizationDescription: {
            type: String,
            default: "",
            trim: true,
        },
        foundedYear: {
            type: Number,
            min: 2000,
            trim: true,
            max: new Date().getFullYear(),
        },
    },

    industry: {
        type: String,
        default: undefined,
        enum: ["", "Technology", "Finance", "Healthcare", "Education",
            "E-commerce", "Consulting", "Other"]
    },

    companyWebsite: {
        type: String,
        default: "",
        trim: true,
        match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/, "Invalid URL format"]
    },
    companyLogo: {
        type: String, // Cloudinary URL
        default: "",
        trim: true,
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpire: {
        type: Date,
        default: undefined
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;