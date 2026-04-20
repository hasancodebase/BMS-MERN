import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) return toast.error("Fill all fields");
    if (form.password.length < 6) return toast.error("Password min 6 characters");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await api.post("/auth/register", { name:form.name, email:form.email, password:form.password });
      toast.success("Account created! You can now login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const score = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const sc = score();
  const scColor = ["","#ef4444","#f97316","#eab308","#22c55e","#10b981"][sc];
  const scLabel = ["","Very Weak","Weak","Fair","Strong","Very Strong"][sc];

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-coral" />
          <span className="font-display font-bold text-xl text-white">Inkwell</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl text-white leading-tight mb-4">
            Share your story<br />with the world
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Join our community of writers. Create, publish and grow your audience on Inkwell.
          </p>
        </div>
        <div className="space-y-3">
          {["✍ Write & publish blogs","❤ Build your audience","💬 Engage with readers","📊 Track your growth"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
              <p className="text-sm text-white/60">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-coral" />
            <span className="font-display font-bold text-xl text-ink">Inkwell</span>
          </div>

          <h1 className="font-display font-black text-3xl text-ink mb-2">Create account</h1>
          <p className="text-ink-muted text-sm mb-8">Join Inkwell — start writing today, it's free</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name:e.target.value }))}
                placeholder="John Doe"
                className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email:e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password:e.target.value }))}
                  placeholder="Min 6 characters"
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-16 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-faint hover:text-ink tracking-widest">
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i<=sc ? scColor : "#e8e4dc" }} />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium" style={{ color:scColor }}>{scLabel}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm:e.target.value }))}
                  placeholder="Re-enter password"
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-10 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans" />
                {form.confirm.length > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    {form.password === form.confirm ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-faint">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-coral font-bold hover:text-coral-dark transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}