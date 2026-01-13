const express = require("express");
const User = require("../models/user"); 
const Course = require("../models/course");
 
 const {validateSignUpData,validateCourseData} = require("../utils/validation");
  
  const bcrypt = require("bcrypt");
const authRouter = express.Router();

 const cookieParser = require("cookie-parser");
 const jwt = require("jsonwebtoken");
 const {userAuth} = require("../middlewares/auth");


// authRouter.post("/signup", async (req, res) => {
//   try {
//     validateSignUpData(req);

//     const passwordHash = await bcrypt.hash(req.body.password, 10);

//     const user = new User({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       address: req.body.address,
//       emailId: req.body.emailId,
//       mobileNo: req.body.mobileNo,
//       password: passwordHash,
//       dob: req.body.dob,
//       age: req.body.age,
//       role: req.body.role,       //  REQUIRED
//       gender: req.body.gender,   //  REQUIRED
//       courseId: req.body.courseId,
//       courseFees: req.body.courseFees
//     });

//     await user.save();

//     res.status(201).json({
//       message: "User added successfully"
//     });

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      address,
      emailId,
      mobileNo,
      password,
      dob,
      age,
      role,
      gender,
      courseId,
      courseFees
    } = req.body;

    //  Role-based validation
    if (role === "student") {
      if (!courseId || !courseFees) {
        throw new Error("Course and Course Fees are required for students");
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    //  Build user object dynamically
    const userData = {
      firstName,
      lastName,
      address,
      emailId,
      mobileNo,
      password: passwordHash,
      dob,
      age,
      role,
      gender
    };

    //  Add course fields ONLY for student
    if (role === "student") {
      userData.courseId = courseId;
      userData.courseFees = courseFees;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: "User added successfully"
    });

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

authRouter.post("/logout", userAuth, async (req,res) =>{
  try{
    res.clearCookie("token");
    res.send("Logout Successfully")
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
 }
});

//GET User Profile 13
authRouter.get("/profileView", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("courseId", "courseName")
      .select("-password");

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.get("/userView", userAuth, async(req,res) => {
  try{
    if(req.user.role !=="admin"){
      return res.status(403).json({error:"Access denied"});
    }

    const users = await User.find()
    .populate("courserId", "courseName")
    .select("-password");  
    res.status(200).json({
      message:"All users fetched successfully",
      data:users
    });
  }
  catch (err) {
    res.status(400).json({
      error : err.message
    })
  }
})


//CourseData

  authRouter.post("/course", userAuth, async (req, res) => {
  try {
    validateCourseData(req);

    const course = new Course(req.body); // ✅ NOW THIS WORKS
    await course.save();

    res.status(201).json({
      message: "Course data added successfully",
      data: course
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.get("/course", userAuth, async (req,res) => {
  try {
    const courses = await Course.find({isActive:true})
    .select("_id courseName")
    .sort({courseName:1});

    res.status(200).json({
      message:"Course dropdown data fetched",
      data : courses
    })

  }
  catch (err) {
    res.status(400).json({
      error: err.message
    })
  }
});
module.exports = authRouter;