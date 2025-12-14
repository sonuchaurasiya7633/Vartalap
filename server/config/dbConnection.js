const mongoose = require("mongoose");

const dbConnect = ()=>{
 
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB connected successfully");   
    })
    .catch((error)=>{
        console.log("DB connection failed");
        console.log(error);
    })

}

module.exports = dbConnect;