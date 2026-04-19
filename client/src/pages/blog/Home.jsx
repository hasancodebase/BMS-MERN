import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const CATEGORIES = ["All", "Technology", "Health", "Business", "Education", "Travel", "Food", "Sports", "Entertainment", "Other"];

const gradients = ["from-violet-500 to-indigo-500", "from-teal-500 to-cyan-500", "from-pink-500 to-rose-500", "from-amber-500 to-orange-500", "from-green-500 to-emerald-500", "from-blue-500 to-sky-500"];

function BlogCard({ blog }) {
  const g = gradients[blog.title?.charCodeAt(0) % gradients.length ?? 0];
  return (
    <Link to={`/blogs/${blog.slug}`}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300 group">
      {blog.image ? (
        <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className={`w-full h-48 bg-gradient-to-br ${g} flex items-center justify-center text-4xl font-black text-white/20`}
          style={{ fontFamily:"'Syne',sans-serif" }}>
          {blog.title?.[0]?.toUpperCase()}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300">
            {blog.category}
          </span>
          <span className="text-[11px] text-gray-600">
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors"
          style={{ fontFamily:"'Syne',sans-serif" }}>
          {blog.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {blog.description?.replace(/<[^>]*>/g, "")}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center text-white text-xs font-bold`}>
              {blog.author?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{blog.author?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>❤ {blog.likes?.length ?? 0}</span>
            <span>👁 {blog.views ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const { data } = await api.get("/blogs", { params });
        setBlogs(data.blogs);
        setPages(data.pages);
      } catch { } finally { setLoading(false); }
    };
    fetchBlogs();
  }, [category, search, page]);

  useEffect(() => {
    api.get("/blogs", { params: { featured: true, limit: 3 } })
      .then(({ data }) => setFeatured(data.blogs))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs text-violet-300 font-medium">Welcome to BMS-MERN</span>
        </div>
        <h1 className="text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily:"'Syne',sans-serif" }}>
          Discover Amazing<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            Blog Stories
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Read, write and share stories that matter. Join our community of writers and readers.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">⌕</span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search blogs..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all" />
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && !search && category === "All" && (
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily:"'Syne',sans-serif" }}>
            ⭐ Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === cat
                ? "text-white"
                : "bg-white/[0.03] border border-white/[0.07] text-gray-400 hover:text-white hover:bg-white/[0.06]"
            }`}
            style={category === cat ? { background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" } : {}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-violet-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-400 text-lg">No blogs found</p>
          <p className="text-gray-600 text-sm mt-2">Be the first to write one!</p>
          <Link to="/create-blog" className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            Write a Blog →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] disabled:opacity-30 hover:bg-white/[0.08] transition-all">
                ← Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm transition-all ${page === p ? "text-white" : "text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"}`}
                  style={page === p ? { background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" } : {}}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] disabled:opacity-30 hover:bg-white/[0.08] transition-all">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}