import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import "dotenv/config";

async function seedNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get Dr. John Smith (the faculty you're logged in as)
    const faculty = await User.findOne({
      email: "faculty@example.com",
    });

    if (!faculty) {
      console.log("❌ Faculty user (faculty@example.com) not found.");
      console.log("Creating Dr. John Smith...");

      // Create Dr. John Smith if doesn't exist
      const newFaculty = new User({
        name: "Dr. John Smith",
        email: "faculty@example.com",
        password: "hashed_password", // You'll need to hash this properly
        role: "faculty",
        department: "ECE",
        avatar: "",
      });

      await newFaculty.save();
      console.log("✅ Created faculty user");
      faculty = newFaculty;
    }

    // Get all other users (as students)
    const allUsers = await User.find();
    const students = allUsers.filter(
      (u) => u._id.toString() !== faculty._id.toString(),
    );

    if (students.length === 0) {
      console.log("❌ No other users found.");
      console.log("💡 Available users:");
      allUsers.forEach((u) => console.log(`   - ${u.name} (${u.email})`));
      process.exit(1);
    }

    console.log(`✅ Found faculty: ${faculty.name} (${faculty.email})`);
    console.log(`✅ Found ${students.length} students`);

    // Clear existing notifications for this faculty
    const deleteResult = await Notification.deleteMany({
      facultyId: faculty._id,
    });
    console.log(
      `🗑️  Cleared ${deleteResult.deletedCount} existing notifications`,
    );

    // Create sample notifications
    const notifications = [];
    const notificationTypes = [
      {
        type: "doubt",
        getMessage: (name) =>
          `${name} raised a doubt in JavaScript Fundamentals`,
        metadata: { courseId: "mock-course-id", lesson: "Closures & Scope" },
      },
      {
        type: "course_completion",
        getMessage: (name) => `${name} completed React Development course`,
        metadata: {
          courseId: "mock-course-id-2",
          courseName: "React Development",
        },
      },
      {
        type: "quiz_submission",
        getMessage: (name) =>
          `${name} submitted Quiz: Variables & Data Types (Score: 95%)`,
        metadata: { quizId: "mock-quiz-id", score: 95 },
      },
      {
        type: "student_progress",
        getMessage: (name) => `${name} reached 75% progress in Python Basics`,
        metadata: { courseId: "mock-course-id-3", progress: 75 },
      },
    ];

    // Create notifications for each student
    students.slice(0, 3).forEach((student, index) => {
      notificationTypes.forEach((notifType, typeIndex) => {
        notifications.push({
          facultyId: faculty._id,
          userId: student._id,
          type: notifType.type,
          message: notifType.getMessage(student.name),
          metadata: notifType.metadata,
          read: index === 0 && typeIndex === 0, // First one is read
          createdAt: new Date(Date.now() - (index * 4 + typeIndex) * 3600000),
        });
      });
    });

    // Add system notification
    if (students.length > 0) {
      notifications.push({
        facultyId: faculty._id,
        userId: students[0]._id,
        type: "system",
        message: "Weekly analytics report is ready for review",
        metadata: {
          reportType: "weekly",
          reportDate: new Date().toISOString(),
        },
        read: false,
        createdAt: new Date(Date.now() - 2 * 3600000),
      });
    }

    await Notification.insertMany(notifications);

    console.log("\n✨ Seed completed successfully!");
    console.log(`📊 Created ${notifications.length} notifications`);
    console.log(`👤 Faculty: ${faculty.name} (${faculty.email})`);
    console.log(`🎓 Students included:`);
    students.slice(0, 3).forEach((student, i) => {
      console.log(`   ${i + 1}. ${student.name} (${student.email})`);
    });
    console.log("\n💡 Refresh your browser to see the notifications!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
    process.exit(1);
  }
}

seedNotifications();
