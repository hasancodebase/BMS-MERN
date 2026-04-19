import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-[#0d0d1a] border-t border-white/[0.06] py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <span className="text-white font-black text-lg" style={{ fontFamily:"'Syne',sans-serif" }}>
          BMS<span className="text-violet-400">-MERN</span>
        </span>
        <div className="flex gap-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/blogs" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Blogs</Link>
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Login</Link>
        </div>
        <p className="text-xs text-gray-600">© 2024 BMS-MERN. All rights reserved.</p>
      </div>
    </footer>
  );
}
