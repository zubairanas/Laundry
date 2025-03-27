const mongoose = require('mongoose');

const {NODE_ENV, DB_LOCAL, DB_CUSTOMDEV, DB_ATLAS} = process.env


const DB = {
  // development: DB_ATLAS,
  development: DB_CUSTOMDEV,
  CustomDev: DB_CUSTOMDEV,
  Live: DB_LOCAL
}

mongoose.connect(DB[NODE_ENV]).then(() => {
    console.log("Database Connected")
}).catch((err) => {
    console.log("Error in Database Connection",err)
})

module.exports = mongoose
// db.js
// const mongoose = require('mongoose');
// require('dotenv').config();  // To load the .env file

// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.DB_LOCAL;
    
//     if (!mongoURI) {
//       throw new Error("MONGO_URI is not defined in .env file");
//     }

//     // Connect to MongoDB
//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("MongoDB connected successfully");

//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err.message);
//     process.exit(1);  // Exit the process if connection fails
//   }
// };

// module.exports = connectDB;
