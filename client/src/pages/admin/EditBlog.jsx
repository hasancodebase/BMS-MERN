import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology","Health","Business","Education","Travel","Food","Sports","Entertainment","Other"];

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", description:"", category:"", tags:"", featured:false, status:"published" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/blogs/id/${id}`)
      .then(({ data }) => {
        setForm({ title:data.title, description:data.description, category:data.category, tags:data.tags?.join(",") || "", featured:data.featured, status:data.status });
        setPreview(data.image || null);
      })
      .catch(() => { toast.error("Blog not found"); navigate("/"); })
      .finally(() => setFetching(false));
  }, [id]);

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
      await api.put(`/blogs/${id}`, fd, { headers:{ "Content-Type":"multipart/form-data" } });
      toast.success("Blog updated!");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const inp = "w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans";
  const lbl = "block text-xs font-bold text-ink uppercase tracking-wider mb-2";

  if (fetching) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <span className="text-xs font-bold text-coral-dark uppercase tracking-wider">Edit Article</span>
          </div>
          <h1 className="font-display font-black text-3xl text-ink">Edit Blog</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

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
                </div>
              )}
            </div>
            <input id="imgInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          <div>
            <label className={lbl}>Title <span className="text-coral normal-case">*</span></label>
            <input type="text" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title:e.target.value }))}
              className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Category <span className="text-coral normal-case">*</span></label>
              <select value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category:e.target.value }))}
                className={inp}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status:e.target.value }))}
                className={inp}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Content <span className="text-coral normal-case">*</span></label>
            <textarea value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description:e.target.value }))}
              rows={14} className={`${inp} resize-none leading-relaxed`} />
          </div>

          <div>
            <label className={lbl}>Tags</label>
            <input type="text" value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags:e.target.value }))}
              placeholder="react, nodejs, webdev"
              className={inp} />
          </div>

          <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl cursor-pointer"
            onClick={() => setForm((p) => ({ ...p, featured:!p.featured }))}>
            <div className={`w-10 h-5 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.featured ? "bg-ink" : "bg-border"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.featured ? "left-5" : "left-0.5"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Feature this post</p>
              <p className="text-xs text-ink-muted">Featured posts appear on homepage</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-ink-muted bg-white border border-border hover:border-ink transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</>
              ) : "Update Blog →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}