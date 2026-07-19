import mongoose from "mongoose" ;

const applicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true,
    },
    candidateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["Applied","Under Review","Rejected","Accepted"],
        default:"Applied",
    },
    resume:{
        type:String,// URL or file path to the resume
        required:true,
    },
    },{timestamps:true});
const Application= mongoose.model("Application", applicationSchema);
export default Application;


//I can always get recruiter info by populating jobId → postedBy. Storing recruiterId separately would be redundant data — breaks database normalization rules.