import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const COLORS = [
  { bg:"bg-ink" },{ bg:"bg-coral-dark" },{ bg:"bg-teal-800" },
  { bg:"bg-amber-900" },{ bg:"bg-blue-900" },{ bg:"bg-purple-900" },
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

export default function SingleBlog() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [b, c] = await Promise.all([
          api.get(`/blogs/${slug}`),
          api.get(`/comments/${slug}`),
        ]);
        setBlog(b.data);
        setLikes(b.data.likes?.length ?? 0);
        setLiked(user ? b.data.likes?.includes(user._id) : false);
        setComments(c.data);
      } catch { toast.error("Blog not found"); navigate("/"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");
    try {
      const { data } = await api.patch(`/blogs/${blog._id}/like`);
      setLikes(data.likes); setLiked(data.liked);
    } catch { toast.error("Failed"); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to comment");
    if (!comment.trim()) return toast.error("Comment cannot be empty");
    setCommenting(true);
    try {
      const { data } = await api.post(`/comments/${blog._id}`, { comment });
      setComments((p) => [data, ...p]);
      setComment("");
      toast.success("Comment added!");
    } catch { toast.error("Failed"); }
    finally { setCommenting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${blog._id}`);
      toast.success("Deleted!"); navigate("/");
    } catch { toast.error("Failed"); }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((p) => p.filter((c) => c._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return null;

  const c = COLORS[blog.title?.charCodeAt(0) % COLORS.length ?? 0];
  const isOwner = user && (user._id === blog.author?._id || user.role === "admin");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8 font-medium">
        ← Back to Blogs
      </Link>

      {/* Cover */}
      {blog.image ? (
        <img src={blog.image} alt={blog.title} className="w-full h-72 object-cover rounded-2xl mb-8 border border-border" />
      ) : (
        <div className={`w-full h-72 ${c.bg} rounded-2xl flex items-center justify-center mb-8`}>
          <span className="font-display font-black text-7xl text-white/15">{blog.title?.[0]?.toUpperCase()}</span>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Badge category={blog.category} />
        <span className="text-xs text-ink-faint">
          {new Date(blog.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
        </span>
        <span className="text-xs text-ink-faint">◎ {blog.views} views</span>
      </div>

      {/* Title */}
      <h1 className="font-display font-black text-4xl text-ink leading-tight mb-6">
        {blog.title}
      </h1>

      {/* Author bar */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-white font-bold`}>
            {blog.author?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{blog.author?.name}</p>
            {blog.author?.bio && <p className="text-xs text-ink-muted">{blog.author.bio}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              liked ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-ink-muted border-border hover:border-ink"
            }`}>
            {liked ? "♥" : "♡"} {likes}
          </button>
          {isOwner && (
            <>
              <Link to={`/edit-blog/${blog._id}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-border bg-white text-ink-soft hover:border-ink transition-all">
                Edit
              </Link>
              <button onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose max-w-none text-ink-soft leading-relaxed text-base mb-10"
        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:"1.8" }}
        dangerouslySetInnerHTML={{ __html: blog.description }} />

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-12 pt-6 border-t border-border">
          {blog.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-cream border border-border text-ink-muted font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-border pt-10">
        <h2 className="font-display font-bold text-2xl text-ink mb-6">
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleComment} className="mb-8 bg-white border border-border rounded-2xl p-5">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all resize-none mb-3 font-sans" />
            <button type="submit" disabled={commenting}
              className="bg-ink text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ink/80 disabled:opacity-60 transition-all">
              {commenting ? "Posting..." : "Post Comment →"}
            </button>
          </form>
        ) : (
          <div className="bg-cream border border-border rounded-2xl p-5 mb-8 text-center">
            <p className="text-sm text-ink-muted">
              <Link to="/login" className="text-coral font-semibold hover:text-coral-dark">Login</Link> to leave a comment
            </p>
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-ink-faint text-sm text-center py-10">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => {
              const col = COLORS[c.user?.name?.charCodeAt(0) % COLORS.length ?? 0];
              return (
                <div key={c._id} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${col.bg} flex items-center justify-center text-white text-xs font-bold`}>
                        {c.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{c.user?.name}</p>
                        <p className="text-xs text-ink-faint">{new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {user && (user._id === c.user?._id || user.role === "admin") && (
                      <button onClick={() => handleDeleteComment(c._id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed">{c.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}