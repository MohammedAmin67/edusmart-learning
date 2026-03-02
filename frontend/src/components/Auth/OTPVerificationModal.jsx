import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const OTPVerificationModal = ({
  isOpen,
  onClose,
  email,
  onVerify,
  isLogin = false,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      toast.error("OTP expired! Please request a new one.");
    }
  }, [isOpen, timer]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (timer === 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    setIsVerifying(true);

    // Mock verification (replace with actual API call)
    // API Call: await fetch('/api/auth/verify-otp', { email, otpCode })

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock success - In production, check against server response
          // For testing: any 6-digit code works (replace with actual validation)
          if (otpCode.length === 6) {
            resolve("OTP verified successfully!");
          } else {
            reject("Invalid OTP. Please try again.");
          }
        }, 1500);
      });

      toast.success("OTP verified! ✅");
      onVerify();
    } catch (error) {
      toast.error("Invalid OTP. Please try again. ❌");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResending) return;

    setIsResending(true);

    // Mock API call to resend OTP
    // API Call: await fetch('/api/auth/resend-otp', { email })
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("OTP resent!");
        }, 1500);
      });

      setTimer(300); // Reset to 5 minutes
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent to your email! 📧");
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-2xl p-8 max-w-md w-full border border-border shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">
                  Verify Your Email
                </h3>
                <p className="text-xs text-muted-foreground mt-1 break-all">
                  Code sent to <span className="font-semibold">{email}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all flex-shrink-0"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Timer */}
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-center gap-2 ${
              timer < 60
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg">
              {timer > 0 ? formatTime(timer) : "Expired"}
            </span>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Enter 6-digit code
            </label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={timer === 0 || isVerifying}
                  className="w-12 h-14 text-center text-2xl font-bold bg-muted rounded-xl border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Resend Section */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <span className="text-muted-foreground">
              Didn't receive the code?
            </span>
            <button
              onClick={handleResendOTP}
              disabled={timer > 240 || isResending || timer === 0}
              className="text-primary font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </>
              )}
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={timer === 0 || isVerifying || otp.join("").length !== 6}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Verify & Continue
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Check your spam folder if you don't see the email.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OTPVerificationModal;
