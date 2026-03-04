import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from database to get latest role
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach user object with role to request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "student", // Default to student if role missing
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ msg: "Token is not valid", error: err.message });
  }
}
