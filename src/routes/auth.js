const express = require("express");
const User = require("../models/user"); 
 const {validateSignUpData} = require("../utils/validation");
  const bcrypt = require("bcrypt");
const authRouter = express.Router();

 const cookieParser = require("cookie-parser");
 const jwt = require("jsonwebtoken");
 const {userAuth} = require("../middlewares/auth");


authRouter.post("/signup", async (req, res) => {
  try {
    // Validate input
    validateSignUpData(req);
    const {firstName, lastName,emailId,password} = req.body;
    // Hash password
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    console.log(passwordHash);
    //  Create user with hashed password
    const user = new User({
      firstName,lastName,emailId,      
      password: passwordHash
    });

    //  Save user
    await user.save();

    res.status(201).send("User added successfully");

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

authRouter.post("/login", async (req,res) =>{
  try{

    const {emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
     const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid){

        //Create JWT Token
        const token = await user.getJWT();
         
        res.cookie("token",token);
        res.send("Login Successfull")
      }
      else{
        throw new Error("Invalid credentials");
      } 
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
 }
}); 

module.exports = authRouter;