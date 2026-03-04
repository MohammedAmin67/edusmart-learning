import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "AI & ML",
        "Cybersecurity",
        "Cloud Computing",
        "DevOps",
        "Game Development",
        "Other",
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String, // e.g., "4 weeks", "10 hours"
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lessons: [
      {
        title: String,
        description: String,
        videoUrl: String,
        duration: String,
        order: Number,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
