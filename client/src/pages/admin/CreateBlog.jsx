import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology","Health","Business","Education","Travel","Food","Sports","Entertainment","Other"];

export default function CreateBlog() {
  const [form, setForm] = useState({ title:"", description:"", category:"", tags:"", featured:false });
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
    if (!form.title || !form.description || !form.category) return toast.error("Fill all required fields");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (image) fd.append("image", image);
      const { data } = await api.post("/blogs", fd, { headers:{ "Content-Type":"multipart/form-data" } });
      toast.success("Blog published!");
      navigate(`/blogs/${data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish");
    } finally { setLoading(false); }
  };

  const inp = "w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans";
  const lbl = "block text-xs font-bold text-ink uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <span className="text-xs font-bold text-coral-dark uppercase tracking-wider">New Article</span>
          </div>
          <h1 className="font-display font-black text-3xl text-ink">Write a Blog</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover Image */}
          <div>
            <label className={lbl}>Cover Image</label>
            <div onClick={() => document.getElementById("imgInput").click()}
              className="w-full h-52 border-2 border-dashed border-border rounded-2xl overflow-hidden cursor-pointer hover:border-ink transition-all relative group bg-white">
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Click to change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-ink-faint">
                  <span className="text-4xl mb-3">🖼</span>
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-xs mt-1">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>
            <input id="imgInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Title */}
          <div>
            <label className={lbl}>Title <span className="text-coral normal-case">*</span></label>
            <input type="text" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title:e.target.value }))}
              placeholder="Enter your blog title..."
              className={inp} />
          </div>

          {/* Category */}
          <div>
            <label className={lbl}>Category <span className="text-coral normal-case">*</span></label>
            <select value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category:e.target.value }))}
              className={inp}>
              <option value="">Select a category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className={lbl}>Content <span className="text-coral normal-case">*</span></label>
            <textarea value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description:e.target.value }))}
              placeholder="Write your blog content here..."
              rows={14}
              className={`${inp} resize-none leading-relaxed`} />
            <p className="text-xs text-ink-faint mt-1.5">{form.description.length} characters</p>
          </div>

          {/* Tags */}
          <div>
            <label className={lbl}>Tags <span className="text-ink-faint font-normal normal-case">(comma separated)</span></label>
            <input type="text" value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags:e.target.value }))}
              placeholder="react, nodejs, webdev, tutorial"
              className={inp} />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl cursor-pointer"
            onClick={() => setForm((p) => ({ ...p, featured:!p.featured }))}>
            <div className={`w-10 h-5 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.featured ? "bg-ink" : "bg-border"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.featured ? "left-5" : "left-0.5"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Feature this post</p>
              <p className="text-xs text-ink-muted">Featured posts appear on the homepage</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-ink-muted bg-white border border-border hover:border-ink transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing...</>
              ) : "Publish Blog →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}