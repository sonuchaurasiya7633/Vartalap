const express = require('express');
const dbConnect = require('./config/dbConnection');
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");
const { app, server } = require('./socket/socket');


app.use(cors());
app.use(express.json());

// mount the route
app.use("/api/v1",authRoute)
app.use("/api/v1",messageRoute)

dbConnect();

server.listen(PORT,()=>{
    console.log(`Server is running successfully at port number ${PORT}`);  
});