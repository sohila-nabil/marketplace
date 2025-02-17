import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("db connected successfully"))
      .catch((err) => console.log(err));
}

export default  dbConnection

