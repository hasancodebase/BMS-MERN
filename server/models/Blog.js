import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: "" },
  category: { type: String, required: true, enum: ["Technology", "Health", "Business", "Education", "Travel", "Food", "Sports", "Entertainment", "Other"] },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["draft", "published"], default: "published" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
