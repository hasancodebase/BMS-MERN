import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const gradients = ["from-violet-500 to-indigo-500","from-teal-500 to-cyan-500","from-pink-500 to-rose-500","from-amber-500 to-orange-500"];

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = () => {
    api.get("/blogs/my-blogs")
      .then(({ data }) => setBlogs(data))
      .catch(() => toast.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted!");
      setBlogs((p) => p.filter((b) => b._id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>My Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">{blogs.length} blog{blogs.length !== 1 ? "s" : ""} published</p>
        </div>
        <Link to="/create-blog"
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
          style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
          + Write New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-7 h-7 text-violet-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-400 text-lg mb-2">No blogs yet</p>
          <p className="text-gray-600 text-sm mb-6">Start writing your first blog!</p>
          <Link to="/create-blog"
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            Write First Blog →
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {blogs.map((blog) => {
              const g = gradients[blog.title?.charCodeAt(0) % gradients.length ?? 0];
              return (
                <div key={blog._id} className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${g} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                      {blog.title?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{blog.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{blog.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${blog.status === "published" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>❤ {blog.likes?.length ?? 0}</span>
                    <span>👁 {blog.views ?? 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/blogs/${blog.slug}`}
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm">
                      👁
                    </Link>
                    <Link to={`/edit-blog/${blog._id}`}
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm">
                      ✎
                    </Link>
                    <button onClick={() => handleDelete(blog._id)}
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/20 transition-all text-sm">
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
  );
}