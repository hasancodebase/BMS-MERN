import Blog from "../models/Blog.js";
import slugify from "slugify";

export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, search, featured } = req.query;
    const query = { status: "published" };
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne(
      slug.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: slug }
        : { slug }
    ).populate("author", "name avatar bio");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, category, tags, featured, status } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description and category are required" });
    }
    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();
    const image = req.file?.path || "";
    const blog = await Blog.create({
      title,
      slug,
      description,
      category,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      image,
      author: req.user._id,
      featured: featured === "true" || featured === true,
      status: status || "published",
    });
    res.status(201).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    const { title, description, category, tags, featured, status } = req.body;
    const image = req.file?.path || blog.image;
    const updated = await Blog.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : blog.tags,
      image,
      featured: featured === "true" || featured === true,
      status: status || blog.status,
    }, { new: true }).populate("author", "name avatar");
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const liked = blog.likes.includes(req.user._id);
    if (liked) blog.likes.pull(req.user._id);
    else blog.likes.push(req.user._id);
    await blog.save();
    res.json({ likes: blog.likes.length, liked: !liked });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getAdminStats = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const [totalBlogs, totalUsers, recentBlogs] = await Promise.all([
      Blog.countDocuments(),
      User.countDocuments(),
      Blog.find().sort({ createdAt: -1 }).limit(5).populate("author", "name"),
    ]);
    res.json({ totalBlogs, totalUsers, recentBlogs });
  } catch (err) { res.status(500).json({ message: err.message }); }
};