import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike, getMyBlogs, getAdminStats } from "../controllers/blogController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/my-blogs", protect, getMyBlogs);
router.get("/admin/stats", protect, adminOnly, getAdminStats);
router.get("/id/:id", protect, getBlog);
router.get("/:slug", getBlog);
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);
router.patch("/:id/like", protect, toggleLike);

export default router;