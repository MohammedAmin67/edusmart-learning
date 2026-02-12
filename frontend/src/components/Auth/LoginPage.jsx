import React, { useState, useContext } from "react";
import { ChevronLeft, Sparkles, Moon, Sun, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../shared/Button";
import { Navigate, Link } from "react-router-dom";
import { DarkModeContext } from "../../App";
import toast from "react-hot-toast";
import API from "../../api/axios.js";

const LoginPage = ({ isLoggedIn, onBack, onLogin, onGoToSignUp }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await API.post("/auth/login", form);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      setSubmitting(false);
      toast.success(response.data.msg || "Login successful!");
      if (onLogin) onLogin(response.data.user);
    } catch (error) {
      setSubmitting(false);
      toast.error(
        error.response?.data?.msg || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col relative overflow-hidden transition-colors duration-700">
      {/* Header */}
      <header className="bg-card/95 shadow-sm sticky top-0 z-50 backdrop-blur-xl border-b border-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-hero rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles className="text-white" size={18} />
              </div>
              <div className="block">
                <span className="text-xl sm:text-3xl font-black gradient-text">
                  EduSmart
                </span>
                <p className="hidden md:block text-sm text-muted-foreground font-medium">
                  Transform Your Future
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-secondary text-secondary-foreground hover:bg-muted transition-all duration-300 hover:scale-105"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Moon size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        style={{ background: "var(--section-hero)" }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-subtle" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-subtle"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="z-10 w-full max-w-md"
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8 md:p-10">
            {/* Back Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted transition-all duration-300 hover:scale-105"
                aria-label="Back to home"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Login to continue your learning journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-foreground font-semibold mb-2 text-sm sm:text-base">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2 text-sm sm:text-base">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-foreground"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-xl font-bold text-base sm:text-lg shadow-accent-glow hover:shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Logging in..." : "Login"}
                {!submitting && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onGoToSignUp}
                  className="text-primary font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-card/98 border-t border-border py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} EduSmart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
