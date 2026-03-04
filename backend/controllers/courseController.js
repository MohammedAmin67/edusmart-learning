import Course from "../models/Course.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get courses by instructor
export const getCoursesByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnail,
      lessons,
    } = req.body;

    // Get instructor details
    const instructor = await User.findById(req.user.id);
    if (!instructor || instructor.role !== "faculty") {
      return res.status(403).json({ msg: "Only faculty can create courses" });
    }

    const course = new Course({
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnail,
      instructor: req.user.id,
      instructorName: instructor.name,
      lessons: lessons || [],
    });

    await course.save();

    res.status(201).json({
      msg: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can only update your own courses" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      msg: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can only delete your own courses" });
    }

    await Course.findByIdAndDelete(id);

    res.json({ msg: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Enroll student in course
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json({ msg: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
