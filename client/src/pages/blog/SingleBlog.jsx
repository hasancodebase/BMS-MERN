import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const gradients = ["from-violet-500 to-indigo-500","from-teal-500 to-cyan-500","from-pink-500 to-rose-500","from-amber-500 to-orange-500"];

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
      setLikes(data.likes);
      setLiked(data.liked);
    } catch { toast.error("Failed to like"); }
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
    } catch { toast.error("Failed to add comment"); }
    finally { setCommenting(false); }
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((p) => p.filter((c) => c._id !== id));
      toast.success("Comment deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${blog._id}`);
      toast.success("Blog deleted");
      navigate("/");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <svg className="animate-spin w-8 h-8 text-violet-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  if (!blog) return null;

  const g = gradients[blog.title?.charCodeAt(0) % gradients.length ?? 0];
  const isOwner = user && (user._id === blog.author?._id || user.role === "admin");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
        ← Back to Blogs
      </Link>

      {/* Cover Image */}
      {blog.image ? (
        <img src={blog.image} alt={blog.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
      ) : (
        <div className={`w-full h-72 bg-gradient-to-br ${g} rounded-2xl flex items-center justify-center text-6xl font-black text-white/20 mb-8`}
          style={{ fontFamily:"'Syne',sans-serif" }}>
          {blog.title?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/15 text-violet-300">
          {blog.category}
        </span>
        <span className="text-xs text-gray-600">
          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <span className="text-xs text-gray-600">👁 {blog.views} views</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black text-white mb-6 leading-tight" style={{ fontFamily:"'Syne',sans-serif" }}>
        {blog.title}
      </h1>

      {/* Author + Actions */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} flex items-center justify-center text-white font-bold`}>
            {blog.author?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{blog.author?.name}</p>
            {blog.author?.bio && <p className="text-xs text-gray-500">{blog.author.bio}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              liked ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-red-400"
            }`}>
            {liked ? "❤" : "🤍"} {likes}
          </button>
          {isOwner && (
            <>
              <Link to={`/edit-blog/${blog._id}`}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                ✎ Edit
              </Link>
              <button onClick={handleDeleteBlog}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
                ✕ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-12 text-gray-300 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: blog.description }} />

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-12">
          {blog.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-white/[0.06] pt-10">
        <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily:"'Syne',sans-serif" }}>
          Comments ({comments.length})
        </h2>

        {/* Add comment */}
        {user ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all resize-none mb-3" />
            <button type="submit" disabled={commenting}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60 hover:opacity-90 transition-all"
              style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
              {commenting ? "Posting..." : "Post Comment →"}
            </button>
          </form>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-8 text-center">
            <p className="text-sm text-gray-400">
              <Link to="/login" className="text-violet-400 hover:text-violet-300">Login</Link> to leave a comment
            </p>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => {
              const cg = gradients[c.user?.name?.charCodeAt(0) % gradients.length ?? 0];
              return (
                <div key={c._id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cg} flex items-center justify-center text-white text-xs font-bold`}>
                        {c.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{c.user?.name}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user && (user._id === c.user?._id || user.role === "admin") && (
                      <button onClick={() => handleDeleteComment(c._id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{c.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}