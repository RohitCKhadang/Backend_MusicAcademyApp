const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const app = express();
 const cookieParser = require("cookie-parser");
 const jwt = require("jsonwebtoken");
 
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");

 app.use("/auth", authRouter);

connectDB().then(() => {
    console.log("Database connect successfully");
    app.listen(5000,() =>{
        console.log("Server is running on port 5000");
    })
}).catch(err =>{
        console.log("Database can not connect successfully...");
 
});