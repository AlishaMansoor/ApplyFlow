import mongoose from 'mongoose';

const dbconnection = async()=>{ 
    try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongodb connected successfully");
    }catch(err){
        console.log("Error connecting mongodb ",err.message);
        process.exit(1);
    }
};
export default dbconnection;


