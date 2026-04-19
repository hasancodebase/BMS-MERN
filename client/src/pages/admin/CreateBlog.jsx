import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology","Health","Business","Education","Travel","Food","Sports","Entertainment","Other"];

export default function CreateBlog() {
  const [form, setForm] = useState({ title: "", description: "", category: "", tags: "", featured: false });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return toast.error("Please fill all required fields");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", image);
      const { data } = await api.post("/blogs", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Blog created successfully!");
      navigate(`/blogs/${data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create blog");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all";
  const labelClass = "block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#080810]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily:"'Syne',sans-serif" }}>
            Write a Blog
          </h1>
          <p className="text-sm text-gray-500">Share your story with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover Image */}
          <div>
            <label className={labelClass}>Cover Image</label>
            <div onClick={() => document.getElementById("imgInput").click()}
              className="w-full h-48 border-2 border-dashed border-white/[0.1] rounded-2xl flex items-center justify-center cursor-pointer hover:border-violet-500/40 transition-all overflow-hidden relative">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <p className="text-3xl mb-2">🖼</p>
                  <p className="text-sm text-gray-500">Click to upload cover image</p>
                  <p className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP</p>
                </div>
              )}
              {preview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm">Click to change</p>
                </div>
              )}
            </div>
            <input id="imgInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title <span className="text-red-400">*</span></label>
            <input type="text" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Enter blog title..."
              className={inputClass} />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category <span className="text-red-400">*</span></label>
            <select value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-all">
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Content <span className="text-red-400">*</span></label>
            <textarea value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Write your blog content here..."
              rows={12}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags <span className="text-gray-600 normal-case">(comma separated)</span></label>
            <input type="text" value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="react, nodejs, webdev"
              className={inputClass} />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <div onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
              className={`w-10 h-5 rounded-full cursor-pointer transition-all duration-300 relative flex-shrink-0 ${form.featured ? "bg-violet-500" : "bg-white/10"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.featured ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-gray-400 cursor-pointer select-none"
              onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}>
              Mark as Featured Post
            </span>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-all"
              style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>Publishing...</>
              ) : "Publish Blog →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}