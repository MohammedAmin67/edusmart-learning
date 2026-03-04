import Doubt from "../models/Doubt.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Get all doubts (Faculty)
export const getAllDoubts = async (req, res) => {
  try {
    // Faculty can see all doubts
    const doubts = await Doubt.find()
      .populate("student", "name email studentId")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get doubts by student
export const getDoubtsByStudent = async (req, res) => {
  try {
    const doubts = await Doubt.find({ student: req.user.id })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Create doubt
export const createDoubt = async (req, res) => {
  try {
    const { courseId, question } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const student = await User.findById(req.user.id);

    const doubt = new Doubt({
      student: req.user.id,
      studentName: student.name,
      course: courseId,
      courseName: course.title,
      question,
    });

    await doubt.save();

    res.status(201).json({
      msg: "Doubt submitted successfully",
      doubt,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Respond to doubt (Faculty only)
export const respondToDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    // Check if user is faculty
    const user = await User.findById(req.user.id);
    if (user.role !== "faculty") {
      return res
        .status(403)
        .json({ msg: "Only faculty can respond to doubts" });
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ msg: "Doubt not found" });
    }

    doubt.response = response;
    doubt.status = "resolved";
    doubt.respondedBy = req.user.id;
    doubt.respondedAt = new Date();

    await doubt.save();

    res.json({
      msg: "Response added successfully",
      doubt,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete doubt
export const deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ msg: "Doubt not found" });
    }

    // Check if user is the student who created it or faculty
    const user = await User.findById(req.user.id);
    if (doubt.student.toString() !== req.user.id && user.role !== "faculty") {
      return res.status(403).json({ msg: "Access denied" });
    }

    await Doubt.findByIdAndDelete(id);

    res.json({ msg: "Doubt deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
