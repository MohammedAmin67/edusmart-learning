import { generateToken } from "../utils/generateToken.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, department, studentId } = req.body;

    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: role || "student",
    };

    // Add role-specific fields
    if (role === "faculty" && department) {
      userData.department = department;
    }
    if (role === "student" && studentId) {
      userData.studentId = studentId;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message || "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Check if role matches (optional security check)
    if (role && user.role !== role) {
      return res.status(400).json({ msg: "Invalid credentials for this role" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error logging in", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ msg: "Logout successful" });
};
