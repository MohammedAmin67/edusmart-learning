import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  GraduationCap,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OTPVerificationModal from "./OTPVerificationModal";

const SignUpPage = ({ onSignUp, onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // student or faculty
    department: "", // Only for faculty
    studentId: "", // Only for students
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "student" && !formData.studentId) {
      toast.error("Please enter your Student ID");
      return;
    }

    if (formData.role === "faculty" && !formData.department) {
      toast.error("Please select your department");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Create pending user object
    const user = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.role === "student" ? { studentId: formData.studentId } : {}),
      ...(formData.role === "faculty"
        ? { department: formData.department }
        : {}),
      createdAt: new Date().toISOString(),
    };

    setPendingUser(user);

    // Mock sending OTP (replace with actual API call)
    // API: await fetch('/api/auth/send-otp', { email: formData.email })
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("OTP sent successfully!");
          setShowOTPModal(true);
        }, 1500);
      }),
      {
        loading: "Sending OTP to your email...",
        success: "OTP sent! Check your email 📧",
        error: "Failed to send OTP",
      },
    );
  };

  const handleOTPVerify = () => {
    setShowOTPModal(false);

    // Store verified user
    localStorage.setItem("user", JSON.stringify(pendingUser));

    toast.success(
      `Account created successfully! Welcome ${pendingUser.role === "faculty" ? "Professor" : "Student"} ${pendingUser.name}! 🎉`,
    );
    onSignUp(pendingUser);

    // Navigate based on role
    if (pendingUser.role === "faculty") {
      navigate("/faculty/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-black text-foreground">EduSmart</h1>
            </div>

            <h2 className="text-4xl font-black text-foreground leading-tight">
              Join Our Smart Learning Platform
            </h2>

            <p className="text-lg text-muted-foreground">
              Create your account and start your learning journey with
              AI-powered education.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    Interactive Learning
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Engage with video lectures and quizzes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    AI-Powered Assistance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant help with AI tutor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          className="bg-card rounded-2xl p-8 border border-border shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <h2 className="text-2xl font-black text-foreground mb-6">
            Create Account
          </h2>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === "student"
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/50 border-transparent hover:border-primary/30"
              }`}
            >
              <GraduationCap
                className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === "student"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <p className="font-bold text-sm text-foreground">Student</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("faculty")}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === "faculty"
                  ? "bg-accent/10 border-accent"
                  : "bg-muted/50 border-transparent hover:border-accent/30"
              }`}
            >
              <Shield
                className={`w-8 h-8 mx-auto mb-2 ${
                  formData.role === "faculty"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
              <p className="font-bold text-sm text-foreground">Faculty</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Conditional Fields based on Role */}
            {formData.role === "student" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., STU2024001"
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}

            {formData.role === "faculty" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="ECE">Electronics and Communication</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="EE">Electrical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              Create {formData.role === "faculty" ? "Faculty" : "Student"}{" "}
              Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline"
            >
              Login here
            </button>
          </p>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        onVerify={handleOTPVerify}
      />
    </div>
  );
};

export default SignUpPage;
