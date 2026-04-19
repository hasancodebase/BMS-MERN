import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="bg-[#0d0d1a] border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center">
            <span className="text-white font-black text-sm" style={{ fontFamily:"'Syne',sans-serif" }}>B</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily:"'Syne',sans-serif" }}>
            BMS<span className="text-violet-400">-MERN</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link to="/blogs" className="text-sm text-gray-400 hover:text-white transition-colors">Blogs</Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/dashboard" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Dashboard</Link>
              )}
              <Link to="/create-blog" className="text-sm text-gray-400 hover:text-white transition-colors">Write</Link>
              <Link to="/my-blogs" className="text-sm text-gray-400 hover:text-white transition-colors">My Blogs</Link>
              <Link to="/profile" className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.[0]?.toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
                style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
