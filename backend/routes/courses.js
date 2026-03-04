import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getAllCourses,
  getCoursesByInstructor,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCourses);

// Protected routes
router.get("/my-courses", auth, getCoursesByInstructor);
router.post("/", auth, createCourse);
router.put("/:id", auth, updateCourse);
router.delete("/:id", auth, deleteCourse);
router.post("/:id/enroll", auth, enrollInCourse);

export default router;
