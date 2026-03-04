import mongoose from "mongoose";
import User from "../models/User.js";
import "dotenv/config";

const createFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if faculty user already exists
    const existingFaculty = await User.findOne({
      email: "faculty@example.com",
    });

    if (existingFaculty) {
      console.log("✅ Faculty user already exists:", existingFaculty.email);
      mongoose.connection.close();
      return;
    }

    // Create faculty user
    const faculty = new User({
      name: "Dr. John Smith",
      email: "faculty@example.com",
      password: "faculty123", // Will be hashed by pre-save hook
      role: "faculty",
      department: "ECE",
    });

    await faculty.save();
    console.log("✅ Faculty user created!");
    console.log("Email:", faculty.email);
    console.log("Password: faculty123");
    console.log("Role:", faculty.role);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating faculty:", error);
    process.exit(1);
  }
};

createFaculty();
