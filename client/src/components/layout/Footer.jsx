import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-coral" />
              <span className="font-display font-bold text-xl">Inkwell</span>
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              A platform for writers and readers who love great content.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Navigate</h4>
              <div className="space-y-2.5">
                <Link to="/" className="block text-sm text-white/60 hover:text-white transition-colors">Home</Link>
                <Link to="/blogs" className="block text-sm text-white/60 hover:text-white transition-colors">Blogs</Link>
                <Link to="/create-blog" className="block text-sm text-white/60 hover:text-white transition-colors">Write</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Account</h4>
              <div className="space-y-2.5">
                <Link to="/login" className="block text-sm text-white/60 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="block text-sm text-white/60 hover:text-white transition-colors">Register</Link>
                <Link to="/profile" className="block text-sm text-white/60 hover:text-white transition-colors">Profile</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-white/30">© 2024 Inkwell — BMS-MERN. All rights reserved.</p>
          <p className="text-xs text-white/30">Built with React + Node.js</p>
        </div>
      </div>
    </footer>
  );
}