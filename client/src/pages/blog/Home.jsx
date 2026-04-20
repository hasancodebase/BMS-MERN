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
    Technology: "bg-blue-50 text-blue-800 border-blue-200",
    Health: "bg-green-50 text-green-800 border-green-200",
    Business: "bg-teal-50 text-teal-800 border-teal-200",
    Education: "bg-purple-50 text-purple-800 border-purple-200",
    Travel: "bg-amber-50 text-amber-800 border-amber-200",
    Food: "bg-orange-50 text-orange-800 border-orange-200",
    Sports: "bg-red-50 text-red-800 border-red-200",
    Entertainment: "bg-pink-50 text-pink-800 border-pink-200",
    Other: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span className={`cat-badge border ${map[category] || map.Other}`}>{category}</span>
  );
}

function CardCover({ blog, height = "h-48" }) {
  const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
  if (blog.image) return <img src={blog.image} alt={blog.title} className={`w-full ${height} object-cover`} />;
  return (
    <div className={`w-full ${height} ${c.bg} flex items-center justify-center`}>
      <span className={`font-display font-black text-5xl ${c.text}`}>{blog.title?.[0]?.toUpperCase()}</span>
    </div>
  );
}

function FeaturedCard({ blog }) {
  return (
    <Link to={`/blogs/${blog.slug}`} className="card group block">
      <CardCover blog={blog} height="h-56" />
      <div className="p-5">
        <Badge category={blog.category} />
        <h3 className="font-display font-bold text-lg text-ink leading-snug mt-2 mb-2 group-hover:text-coral transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-ink-muted line-clamp-2 mb-4 leading-relaxed">
          {blog.description?.replace(/<[^>]*>/g, "")}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center text-white text-xs font-bold">
              {blog.author?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-medium text-ink-soft">{blog.author?.name}</span>
          </div>
          <div className="flex gap-3 text-xs text-ink-faint">
            <span>♥ {blog.likes?.length ?? 0}</span>
            <span>◎ {blog.views ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ blog }) {
  return (
    <Link to={`/blogs/${blog.slug}`} className="card group flex gap-4 p-4 hover:border-coral/30 transition-all">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <CardCover blog={blog} height="h-20" />
      </div>
      <div className="flex-1 min-w-0">
        <Badge category={blog.category} />
        <h3 className="font-display font-bold text-sm text-ink mt-1.5 line-clamp-2 group-hover:text-coral transition-colors leading-snug">
          {blog.title}
        </h3>
        <p className="text-xs text-ink-faint mt-1">
          {blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
        </p>
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
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
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

  useEffect(() => {
    api.get("/blogs", { params: { featured: true, limit: 3 } })
      .then(({ data }) => setFeatured(data.blogs))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border-b border-border py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-coral-light border border-coral/20 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span className="text-[11px] font-bold text-coral-dark uppercase tracking-wider">Blog Platform</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="font-display font-black text-5xl text-ink leading-tight mb-4">
                Stories that<br /><span className="text-coral">Inspire</span> & Inform
              </h1>
              <p className="text-ink-muted max-w-md leading-relaxed">
                Discover thoughtful articles from writers around the world. Ideas that challenge, entertain and educate.
              </p>
            </div>
            <div className="flex items-center gap-0 bg-cream border-2 border-border rounded-xl p-1 max-w-sm w-full">
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search articles..."
                className="bg-transparent flex-1 px-4 py-2 text-sm text-ink placeholder-ink-faint outline-none font-sans" />
              <button className="bg-ink text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-ink/80 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink-muted border-border hover:border-ink hover:text-ink"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Featured */}
        {featured.length > 0 && !search && category === "All" && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">Featured Posts</h2>
              <Link to="/blogs" className="text-xs font-bold text-coral hover:text-coral-dark transition-colors">See all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((blog) => <FeaturedCard key={blog._id} blog={blog} />)}
            </div>
          </div>
        )}

        {/* Latest */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-ink">
            {search ? `Results for "${search}"` : category !== "All" ? category : "Latest Articles"}
          </h2>
          <span className="text-xs text-ink-faint">{total} articles</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <p className="font-display font-bold text-2xl text-ink mb-2">No articles found</p>
            <p className="text-ink-muted text-sm mb-6">Be the first to write about this topic!</p>
            <Link to="/create-blog" className="bg-ink text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ink/80 transition-all">
              Write a Blog →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {blogs.map((blog) => <SmallCard key={blog._id} blog={blog} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-ink-muted border border-border bg-white disabled:opacity-30 hover:border-ink transition-all">
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i+1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      page===p ? "bg-ink text-white" : "bg-white border border-border text-ink-muted hover:border-ink"
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(pages, p+1))} disabled={page===pages}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-ink-muted border border-border bg-white disabled:opacity-30 hover:border-ink transition-all">
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Newsletter */}
        <div className="bg-ink rounded-2xl p-10 mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">Stay in the loop</h3>
            <p className="text-white/50 text-sm max-w-sm">Get the best articles delivered to your inbox every week. No spam, ever.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input placeholder="your@email.com"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none flex-1 md:w-56 font-sans" />
            <button className="bg-coral text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-coral-dark transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}