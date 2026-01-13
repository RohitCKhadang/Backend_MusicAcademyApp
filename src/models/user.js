const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
     
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    address:{
        type:String,
        maxLength:100,
        trim:true,    
    },
    emailId: {
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
               
                throw new Error("Invalid email address: " + value);
            }
        }

    },
    password: {
        type:String,
        required:true,        
        validate(value){
            if(!validator.isStrongPassword(value)){
               
                throw new Error("Password is not strong: " + value);
            }
        }
    },
    mobileNo:{
        type:Number,

    },
    dob:{
        type:Date,
    },
    age:{
        type:Number,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: function () {
        return this.role === "student";
      }
    },
    role:{
        type:String,
        required:true,
        validate(value){
            if(!["student","admin"].includes(value)){
                throw new Error("Role data is not valid")
                }
        }
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    courseFees:{
        type:Number
    },
    photoUrl:{
        type:String,
    },
    about:{
        type:String,
        default:"This is a default about of the user"
    },
    skills:{
        type:[String],
    },
},
    {
        timestamps:true    
    }
);
 
userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id:user._id},"ROH@IT$K",{
          expiresIn:"7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    );
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);