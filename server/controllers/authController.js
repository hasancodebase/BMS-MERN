import crypto from "crypto";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    const verifyToken = crypto.randomBytes(32).toString("hex");
    await User.create({ name, email, password, emailVerifyToken: verifyToken, isEmailVerified: true });
    res.status(201).json({ message: "Registered successfully! You can now login." });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(user._id, rememberMe);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getProfile = async (req, res) => res.json(req.user);

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name, bio: req.body.bio }, { new: true }).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(req.body.currentPassword))) return res.status(400).json({ message: "Current password incorrect" });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
