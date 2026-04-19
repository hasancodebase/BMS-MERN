import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const gradients = ["from-violet-500 to-indigo-500","from-teal-500 to-cyan-500","from-pink-500 to-rose-500","from-amber-500 to-orange-500"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-violet-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-white" style={{ fontFamily:"'Syne',sans-serif" }}>Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your blog platform</p>
          </div>
          <Link to="/create-blog"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            + New Blog
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label:"Total Blogs", value: stats?.totalBlogs ?? 0, icon:"📝", color:"border-violet-500/20 bg-violet-500/5" },
            { label:"Total Users", value: stats?.totalUsers ?? 0, icon:"👥", color:"border-teal-500/20 bg-teal-500/5" },
            { label:"Recent Posts", value: stats?.recentBlogs?.length ?? 0, icon:"🔥", color:"border-pink-500/20 bg-pink-500/5" },
            { label:"Published", value: stats?.totalBlogs ?? 0, icon:"✅", color:"border-amber-500/20 bg-amber-500/5" },
          ].map((s) => (
            <div key={s.label} className={`border ${s.color} rounded-2xl p-5`}>
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-3xl font-black text-white mb-1" style={{ fontFamily:"'Syne',sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Blogs */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <h2 className="text-base font-semibold text-white" style={{ fontFamily:"'Syne',sans-serif" }}>Recent Blogs</h2>
            <Link to="/my-blogs" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all →</Link>
          </div>
          {stats?.recentBlogs?.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">No blogs yet</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {stats?.recentBlogs?.map((blog) => {
                const g = gradients[blog.title?.charCodeAt(0) % gradients.length ?? 0];
                return (
                  <div key={blog._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {blog.title?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{blog.title}</p>
                      <p className="text-xs text-gray-500">{blog.author?.name} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300">{blog.category}</span>
                    <div className="flex gap-2">
                      <Link to={`/edit-blog/${blog._id}`}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm">
                        ✎
                      </Link>
                      <Link to={`/blogs/${blog.slug}`}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm">
                        →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:"Write Blog", icon:"✍", to:"/create-blog" },
            { label:"My Blogs", icon:"📚", to:"/my-blogs" },
            { label:"View Site", icon:"🌐", to:"/" },
            { label:"Profile", icon:"👤", to:"/profile" },
          ].map((a) => (
            <Link key={a.label} to={a.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}