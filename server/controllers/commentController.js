import Comment from "../models/Comment.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({ blog: req.params.blogId, user: req.user._id, comment: req.body.comment });
    const populated = await comment.populate("user", "name avatar");
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
