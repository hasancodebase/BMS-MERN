import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"", rememberMe:false });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-coral" />
          <span className="font-display font-bold text-xl text-white">Inkwell</span>
        </div>
        <div>
          <blockquote className="font-display font-bold text-3xl text-white leading-tight mb-4">
            "The pen is mightier than the sword — and the keyboard, mightier than both."
          </blockquote>
          <p className="text-white/40 text-sm">Join thousands of writers sharing their stories.</p>
        </div>
        <div className="flex gap-4">
          {["📝 500+ Articles","👥 200+ Writers","❤ 10k+ Readers"].map((s) => (
            <div key={s} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <p className="text-xs text-white/60 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-coral" />
            <span className="font-display font-bold text-xl text-ink">Inkwell</span>
          </div>

          <h1 className="font-display font-black text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">Sign in to your account to continue writing</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email:e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password:e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans pr-16" />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-faint hover:text-ink tracking-widest transition-colors">
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer"
                onClick={() => setForm((p) => ({ ...p, rememberMe:!p.rememberMe }))}>
                <div className={`w-10 h-5 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.rememberMe ? "bg-ink" : "bg-border"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.rememberMe ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-ink-muted select-none">Remember me</span>
              </div>
              <Link to="/login" className="text-xs font-semibold text-coral hover:text-coral-dark transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : "Sign In →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-faint">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-ink-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-coral font-bold hover:text-coral-dark transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}