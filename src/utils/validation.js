const validator = require("validator");

const validateSignUpData = (req) =>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
};

 const validateCourseData = (req) => {
  const { courseName, isActive } = req.body;

  if (!courseName || courseName.length < 4 || courseName.length > 100) {
    throw new Error("Course name is not valid");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be true or false");
  }
};


module.exports ={
    validateSignUpData,
    validateCourseData
}