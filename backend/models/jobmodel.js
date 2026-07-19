import mongoose from 'mongoose';
import Application from './applicationmodel.js'

const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    companyName:{
        type:String,
        required:true,
        trim:true,
    },
    jobType:{
        type:String,
        enum:["Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship"],
    },
    skillsRequired:[
        {
            type:String,
            required:true,
        }
    ],
    experience:{
        type:Number,
        min:0,
        max:20,
    },
    location:{
        type:String,
        required:true,
        trim:true,
    },
    salaryRange:{
         min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    }
    },
    description:{
        type:String,
        requierd:true
    },
    status:{
        type:String,  
        enum:["Open","Closed"],
        default:"Open",
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},{ timestamps: true });

//cascading delete, deleting applications of job before deleting the job
jobSchema.pre('findOneAndDelete',async function(){
      // → { _id: '69cb9f...' }  ← this.getQuery()
      // → '69cb9f...'  ← this.getQuery()._id just the id
    const jobId= this.getQuery()._id;
    // console.log(`Deleting applications for job: ${jobId} before deleting the job, mongoose premiddleware.`);
    await Application.deleteMany({ jobId });
    // next();no next() needed — async function returning is enough
})
const Job= mongoose.model("Job", jobSchema);
export default Job;
