import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const CATEGORIES = ["All","Technology","Health","Business","Education","Travel","Food","Sports","Entertainment","Other"];

const COLORS = [
  { bg:"bg-ink", text:"text-white/20" },
  { bg:"bg-coral-dark", text:"text-white/20" },
  { bg:"bg-teal-800", text:"text-white/20" },
  { bg:"bg-amber-900", text:"text-white/20" },
  { bg:"bg-blue-900", text:"text-white/20" },
  { bg:"bg-purple-900", text:"text-white/20" },
];

function Badge({ category }) {
  const map = {
    Technology:"bg-blue-50 text-blue-800 border-blue-200",
    Health:"bg-green-50 text-green-800 border-green-200",
    Business:"bg-teal-50 text-teal-800 border-teal-200",
    Education:"bg-purple-50 text-purple-800 border-purple-200",
    Travel:"bg-amber-50 text-amber-800 border-amber-200",
    Food:"bg-orange-50 text-orange-800 border-orange-200",
    Sports:"bg-red-50 text-red-800 border-red-200",
    Entertainment:"bg-pink-50 text-pink-800 border-pink-200",
    Other:"bg-gray-50 text-gray-700 border-gray-200",
  };
  return <span className={`cat-badge border ${map[category]||map.Other}`}>{category}</span>;
}

function CardCover({ blog, height="h-48" }) {
  const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
  if (blog.image) return <img src={blog.image} alt={blog.title} className={`w-full ${height} object-cover group-hover:scale-105 transition-transform duration-300`} />;
  return (
    <div className={`w-full ${height} ${c.bg} flex items-center justify-center`}>
      <span className={`font-display font-black text-5xl ${c.text}`}>{blog.title?.[0]?.toUpperCase()}</span>
    </div>
  );
}

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const { data } = await api.get("/blogs", { params });
        setBlogs(data.blogs);
        setPages(data.pages);
        setTotal(data.total);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, [category, search, page]);

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display font-black text-4xl text-ink mb-2">All Articles</h1>
          <p className="text-ink-muted">{total} articles published across all categories</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint text-sm">⌕</span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
          </div>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-white border border-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-all font-sans">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                category===cat ? "bg-ink text-white border-ink" : "bg-white text-ink-muted border-border hover:border-ink hover:text-ink"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <p className="font-display font-bold text-2xl text-ink mb-2">No articles found</p>
            <p className="text-ink-muted text-sm">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => {
                const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
                return (
                  <Link key={blog._id} to={`/blogs/${blog.slug}`}
                    className="card group block hover:border-coral/30 transition-all duration-300">
                    <div className="overflow-hidden">
                      <CardCover blog={blog} height="h-44" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge category={blog.category} />
                        <span className="text-[11px] text-ink-faint">
                          {new Date(blog.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-ink line-clamp-2 mb-2 group-hover:text-coral transition-colors leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-ink-muted line-clamp-2 mb-4 leading-relaxed">
                        {blog.description?.replace(/<[^>]*>/g,"")}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg ${c.bg} flex items-center justify-center text-white text-[10px] font-bold`}>
                            {blog.author?.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-ink-soft">{blog.author?.name}</span>
                        </div>
                        <div className="flex gap-3 text-[11px] text-ink-faint">
                          <span>♥ {blog.likes?.length??0}</span>
                          <span>◎ {blog.views??0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => setPage((p) => Math.max(1,p-1))} disabled={page===1}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-white text-ink-muted disabled:opacity-30 hover:border-ink transition-all">
                  ← Prev
                </button>
                {Array.from({length:pages},(_,i)=>i+1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      page===p ? "bg-ink text-white" : "bg-white border border-border text-ink-muted hover:border-ink"
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(pages,p+1))} disabled={page===pages}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-white text-ink-muted disabled:opacity-30 hover:border-ink transition-all">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}