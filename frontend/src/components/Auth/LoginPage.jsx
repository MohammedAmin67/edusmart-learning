import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  GraduationCap,
  ChevronLeft,
  LogIn,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OTPVerificationModal from "./OTPVerificationModal";

const LoginPage = ({ onLogin, onBack, onGoToSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // Default to student
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered user on component mount (email and role only, NOT auto-login)
  useEffect(() => {
    // Clear the logged out flag when coming to login page
    sessionStorage.removeItem("loggedOut");

    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      try {
        const { email, role } = JSON.parse(rememberedUser);
        setFormData((prev) => ({
          ...prev,
          email,
          role,
        }));
        setRememberMe(true);
      } catch (error) {
        console.error("Error loading remembered user:", error);
        localStorage.removeItem("rememberedUser");
      }
    }
  }, []);

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

  const validateCredentials = async (email, password, role) => {
    // Mock credential validation
    // In production, this would call your backend API

    // Demo credentials for testing
    const validCredentials = {
      student: {
        email: "student@test.com",
        password: "student123",
      },
      faculty: {
        email: "faculty@test.com",
        password: "faculty123",
      },
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if credentials match
    const isValid =
      email === validCredentials[role].email &&
      password === validCredentials[role].password;

    if (!isValid) {
      // For demo purposes, accept any email/password combination
      // Remove this in production and only return isValid
      return true; // CHANGE THIS TO: return isValid; in production
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Validate credentials
      const isValidUser = await validateCredentials(
        formData.email,
        formData.password,
        formData.role,
      );

      if (!isValidUser) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Check last login time
      const lastLogin = localStorage.getItem(`lastLogin_${formData.email}`);
      const currentTime = new Date().getTime();

      let daysSinceLastLogin = 999;
      if (lastLogin) {
        daysSinceLastLogin =
          (currentTime - parseInt(lastLogin)) / (1000 * 60 * 60 * 24);
      }

      // Create user object
      const user = {
        id: Date.now(),
        name: formData.role === "faculty" ? "Dr. John Smith" : "John Doe",
        email: formData.email,
        role: formData.role,
        ...(formData.role === "student" ? { studentId: "STU2024001" } : {}),
        ...(formData.role === "faculty" ? { department: "ECE" } : {}),
      };

      // Check if remember me allows skipping OTP
      const rememberedUser = localStorage.getItem("rememberedUser");
      const isRememberedUser =
        rememberedUser && JSON.parse(rememberedUser).email === formData.email;
      const skipOTP =
        rememberMe && isRememberedUser && daysSinceLastLogin <= 30;

      // Check if OTP is required (login after 30 days or first login)
      if (!skipOTP && (daysSinceLastLogin > 30 || !lastLogin)) {
        // OTP required
        setPendingUser(user);
        setRequiresOTP(true);

        // Send OTP
        toast.promise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve("OTP sent successfully!");
              setShowOTPModal(true);
              setIsLoading(false);
            }, 1500);
          }),
          {
            loading: "Verifying credentials...",
            success: "OTP sent to your email! 📧",
            error: "Failed to send OTP",
          },
        );
      } else {
        // Direct login (no OTP required)
        performLogin(user);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const performLogin = (user) => {
    const currentTime = new Date().getTime();

    // Clear the logged out flag
    sessionStorage.removeItem("loggedOut");

    // Store user and update last login
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(`lastLogin_${user.email}`, currentTime.toString());

    // Save credentials if "Remember Me" is checked (email and role only)
    if (rememberMe) {
      localStorage.setItem(
        "rememberedUser",
        JSON.stringify({
          email: user.email,
          role: user.role,
        }),
      );
    } else {
      // Clear remembered user if not checked
      localStorage.removeItem("rememberedUser");
    }

    toast.success(`Welcome back, ${user.name}! 🎉`);
    onLogin(user);

    // Navigate based on role
    setTimeout(() => {
      if (user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 100);
  };

  const handleOTPVerify = () => {
    setShowOTPModal(false);
    performLogin(pendingUser);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
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
              Welcome Back to Smart Learning
            </h2>

            <p className="text-lg text-muted-foreground">
              Sign in to continue your learning journey with AI-powered
              education.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Demo Credentials
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Student:</strong> student@test.com / student123
                </p>
                <p>
                  <strong>Faculty:</strong> faculty@test.com / faculty123
                </p>
                <p className="text-xs mt-2">
                  Or use any email/password for testing
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
            disabled={isLoading}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <h2 className="text-2xl font-black text-foreground mb-6">
            Login to Your Account
          </h2>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              disabled={isLoading}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === "student"
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/50 border-transparent hover:border-primary/30"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
              disabled={isLoading}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === "faculty"
                  ? "bg-accent/10 border-accent"
                  : "bg-muted/50 border-transparent hover:border-accent/30"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

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
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me for 30 days
                </span>
              </label>
              <button
                type="button"
                disabled={isLoading}
                className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login as {formData.role === "faculty" ? "Faculty" : "Student"}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={onGoToSignUp}
              disabled={isLoading}
              className="text-primary font-bold hover:underline disabled:opacity-50"
            >
              Sign up here
            </button>
          </p>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setIsLoading(false);
        }}
        email={formData.email}
        onVerify={handleOTPVerify}
        isLogin={true}
      />
    </div>
  );
};

export default LoginPage;
