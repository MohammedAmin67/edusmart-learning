import mongoose from "mongoose";
import User from "../models/User.js";
import "dotenv/config";

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Update all users without a role to be students
    const result = await User.updateMany(
      {
        $or: [{ role: { $exists: false } }, { role: null }],
      },
      {
        $set: {
          role: "student",
          status: "active",
          progress: 0,
          averageScore: 0,
          totalQuizzes: 0,
          completedQuizzes: 0,
          lastActive: "Recently",
          trend: "stable",
          attentionScore: 0,
        },
      },
    );

    console.log(`✅ Updated ${result.modifiedCount} users with role='student'`);

    // Display all users
    const users = await User.find({}).select("name email role");
    console.log("\n📋 Current Users:");
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    mongoose.connection.close();
    console.log("\n✅ Migration completed!");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

migrateUsers();
