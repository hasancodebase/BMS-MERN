import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getComments, addComment, deleteComment } from "../controllers/commentController.js";
const router = express.Router();
router.get("/:blogId", getComments);
router.post("/:blogId", protect, addComment);
router.delete("/:id", protect, deleteComment);
export default router;
