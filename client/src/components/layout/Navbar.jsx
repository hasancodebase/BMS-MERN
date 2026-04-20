import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-coral" />
          <span className="font-display font-bold text-xl text-ink tracking-tight">Inkwell</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-ink-muted hover:text-ink font-medium transition-colors">Home</Link>
          <Link to="/blogs" className="text-sm text-ink-muted hover:text-ink font-medium transition-colors">Blogs</Link>
          {user && (
            <Link to="/create-blog" className="text-sm text-ink-muted hover:text-ink font-medium transition-colors">Write</Link>
          )}
          {user && (
            <Link to="/my-blogs" className="text-sm text-ink-muted hover:text-ink font-medium transition-colors">My Blogs</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/dashboard" className="text-sm text-coral font-semibold transition-colors">Dashboard</Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile"
                className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center text-white text-sm font-bold hover:bg-ink/80 transition-all">
                {user.name?.[0]?.toUpperCase()}
              </Link>
              <button onClick={handleLogout}
                className="text-sm text-ink-muted hover:text-coral transition-colors font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink-muted hover:text-ink font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register"
                className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ink/80 transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}