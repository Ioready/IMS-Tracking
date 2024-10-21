import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config() 

const connection = async()=>{
 try{
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });   
       console.log("connected")
 }catch(e){
    console.log(e)
 } 
}

export default connection