import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "faculty"],
      default: "student", // Default all users to student
      required: true,
    },
    department: {
      type: String,
      default: "",
    },
    studentId: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    // Additional student fields
    phone: {
      type: String,
      default: "",
    },
    semester: {
      type: String,
      default: "",
    },
    enrolledCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
      default: [],
    },
    completedCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalQuizzes: {
      type: Number,
      default: 0,
    },
    completedQuizzes: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: String,
      default: "Recently",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "at-risk"],
      default: "active",
    },
    trend: {
      type: String,
      enum: ["up", "down", "stable"],
      default: "stable",
    },
    attentionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password to hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
