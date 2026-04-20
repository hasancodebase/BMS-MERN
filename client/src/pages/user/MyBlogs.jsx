import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const COLORS = ["bg-ink","bg-coral-dark","bg-teal-800","bg-amber-900","bg-blue-900","bg-purple-900"];

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs/my-blogs")
      .then(({ data }) => setBlogs(data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Deleted!");
      setBlogs((p) => p.filter((b) => b._id !== id));
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-coral" />
              <span className="text-xs font-bold text-coral-dark uppercase tracking-wider">My Articles</span>
            </div>
            <h1 className="font-display font-black text-3xl text-ink">My Blogs</h1>
            <p className="text-ink-muted text-sm mt-1">{blogs.length} article{blogs.length !== 1 ? "s" : ""} published</p>
          </div>
          <Link to="/create-blog"
            className="bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-ink/80 transition-all">
            + Write New
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <p className="text-5xl mb-4">📝</p>
            <p className="font-display font-bold text-2xl text-ink mb-2">No blogs yet</p>
            <p className="text-ink-muted text-sm mb-6">Start writing your first blog!</p>
            <Link to="/create-blog"
              className="bg-ink text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-ink/80 transition-all">
              Write First Blog →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {blogs.map((blog) => {
                const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
                return (
                  <div key={blog._id} className="flex items-center gap-4 px-6 py-5 hover:bg-cream transition-colors">
                    {blog.image ? (
                      <img src={blog.image} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-border" />
                    ) : (
                      <div className={`w-14 h-14 rounded-xl ${c} flex items-center justify-center text-white font-black text-xl flex-shrink-0`}>
                        {blog.title?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-ink truncate">{blog.title}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-ink-faint">{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                          {blog.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          blog.status==="published" ? "bg-green-50 text-green-800 border border-green-200" : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}>
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-faint flex-shrink-0">
                      <span>♥ {blog.likes?.length??0}</span>
                      <span>◎ {blog.views??0}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to={`/blogs/${blog.slug}`}
                        className="w-9 h-9 rounded-lg border border-border bg-cream flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all text-sm">
                        👁
                      </Link>
                      <Link to={`/edit-blog/${blog._id}`}
                        className="w-9 h-9 rounded-lg border border-border bg-cream flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all text-sm">
                        ✎
                      </Link>
                      <button onClick={() => handleDelete(blog._id)}
                        className="w-9 h-9 rounded-lg border border-border bg-cream flex items-center justify-center text-ink-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-sm">
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}