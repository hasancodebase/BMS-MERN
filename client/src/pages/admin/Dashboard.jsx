import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const COLORS = ["bg-ink","bg-coral-dark","bg-teal-800","bg-amber-900","bg-blue-900","bg-purple-900"];

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
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-coral" />
              <span className="text-xs font-bold text-coral-dark uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="font-display font-black text-3xl text-ink">Dashboard</h1>
          </div>
          <Link to="/create-blog"
            className="bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-ink/80 transition-all">
            + New Blog
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label:"Total Blogs", value:stats?.totalBlogs??0, icon:"📝", border:"border-l-4 border-l-ink" },
            { label:"Total Users", value:stats?.totalUsers??0, icon:"👥", border:"border-l-4 border-l-coral" },
            { label:"Recent Posts", value:stats?.recentBlogs?.length??0, icon:"🔥", border:"border-l-4 border-l-teal-600" },
            { label:"Published", value:stats?.totalBlogs??0, icon:"✅", border:"border-l-4 border-l-amber-600" },
          ].map((s) => (
            <div key={s.label} className={`bg-white border border-border rounded-xl p-5 ${s.border}`}>
              <div className="text-xl mb-3">{s.icon}</div>
              <div className="font-display font-black text-3xl text-ink mb-1">{s.value}</div>
              <div className="text-xs text-ink-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Blogs */}
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg text-ink">Recent Blogs</h2>
              <Link to="/my-blogs" className="text-xs font-bold text-coral hover:text-coral-dark transition-colors">View all →</Link>
            </div>
            {!stats?.recentBlogs?.length ? (
              <div className="text-center py-16 text-ink-faint text-sm">No blogs yet</div>
            ) : (
              <div className="divide-y divide-border">
                {stats.recentBlogs.map((blog) => {
                  const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
                  return (
                    <div key={blog._id} className="flex items-center gap-4 px-6 py-4 hover:bg-cream transition-colors">
                      <div className={`w-10 h-10 rounded-xl ${c} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {blog.title?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{blog.title}</p>
                        <p className="text-xs text-ink-faint">{blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                        {blog.category}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/edit-blog/${blog._id}`}
                          className="w-8 h-8 rounded-lg border border-border bg-cream flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all text-sm">
                          ✎
                        </Link>
                        <Link to={`/blogs/${blog.slug}`}
                          className="w-8 h-8 rounded-lg border border-border bg-cream flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all text-sm">
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
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label:"Write New Blog", icon:"✍", to:"/create-blog", primary:true },
                { label:"My Blogs", icon:"📚", to:"/my-blogs" },
                { label:"View Site", icon:"🌐", to:"/" },
                { label:"Profile", icon:"👤", to:"/profile" },
              ].map((a) => (
                <Link key={a.label} to={a.to}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    a.primary
                      ? "bg-ink text-white border-ink hover:bg-ink/80"
                      : "bg-cream border-border text-ink hover:border-ink"
                  }`}>
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-sm font-semibold">{a.label}</span>
                  <span className="ml-auto text-sm opacity-50">→</span>
                </Link>
              ))}
            </div>

            {/* Mini stats */}
            <div className="mt-6 pt-5 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink-muted">Total Views</span>
                <span className="text-sm font-bold text-ink">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink-muted">Total Likes</span>
                <span className="text-sm font-bold text-ink">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink-muted">Platform</span>
                <span className="text-xs font-bold text-coral">BMS-MERN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}