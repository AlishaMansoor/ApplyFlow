import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinaryconfig.js";


// Storage for profile fields
const profileFieldsStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req,file)=>{
    const folderName= file.fieldname ==="companyLogo" ? "JobApplicationTracker/CompanyLogos" : "JobApplicationTracker/ProfileImages";
    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg"],
      resource_type: "image",
    }
  }
});

  

//Storage for resume
const resumeStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    console.log("Uploading file:", file.originalname);
    return {
      folder: "JobApplicationTrackerResumes",
      resource_type: "raw",
      format: "pdf",
      public_id: `resume_${req.user.userid}_${Date.now()}`, // unique name per user

    }
  },
});


export const updateProfileFields = multer({ storage: profileFieldsStorage }).fields([{name:"profileImage",maxCount:1}, {name:"companyLogo",maxCount:1}]);
export const uploadResume = multer({ storage: resumeStorage });