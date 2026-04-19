import jwt from "jsonwebtoken";
export const generateToken = (id, rememberMe = false) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? "7d" : "1d" });
