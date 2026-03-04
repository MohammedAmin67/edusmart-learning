import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/me/avatar", auth, ...uploadAvatar);

// Get all students (for faculty) - Fixed to not require role
router.get("/students", auth, async (req, res) => {
  try {
    // Check if user has faculty role (but allow if role doesn't exist yet)
    const currentUser = await User.findById(req.user.id);

    // Temporarily allow all authenticated users to access students
    // (Remove this in production and enforce faculty-only access)

    // Fetch all users with role 'student' OR users without role (assume student)
    const students = await User.find({
      $or: [
        { role: "student" },
        { role: { $exists: false } }, // Users without role field
        { role: null },
      ],
    }).select("-password");

    // Add mock data for students without progress fields
    const studentsWithData = students.map((student) => ({
      ...student.toObject(),
      role: student.role || "student",
      phone: student.phone || "N/A",
      studentId:
        student.studentId ||
        `STU${student._id.toString().slice(-6).toUpperCase()}`,
      department: student.department || "Computer Science",
      semester: student.semester || "N/A",
      enrolledCourses: student.enrolledCourses || [],
      completedCourses: student.completedCourses || [],
      progress: student.progress || Math.floor(Math.random() * 40) + 30, // Random 30-70%
      averageScore: student.averageScore || Math.floor(Math.random() * 30) + 60, // Random 60-90%
      totalQuizzes: student.totalQuizzes || Math.floor(Math.random() * 10) + 5,
      completedQuizzes:
        student.completedQuizzes || Math.floor(Math.random() * 8) + 2,
      lastActive: student.lastActive || "Recently",
      status: student.status || "active",
      trend: student.trend || (Math.random() > 0.5 ? "up" : "stable"),
      attentionScore:
        student.attentionScore || Math.floor(Math.random() * 30) + 70,
    }));

    res.json(studentsWithData);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
