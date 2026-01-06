const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://NodeProj_db_user:32hcRm4onPtJjuwn@nodeproject.dycepga.mongodb.net/MusicAcademyMobileApp"
    )
};

module.exports = connectDB;