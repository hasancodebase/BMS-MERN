import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const COLORS = ["bg-ink","bg-coral-dark","bg-teal-800","bg-amber-900","bg-blue-900","bg-purple-900"];

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:user?.name||"", bio:user?.bio||"" });
  const [pw, setPw] = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [tab, setTab] = useState("profile");
  const c = COLORS[user?.name?.charCodeAt(0) % COLORS.length ?? 0];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      login(localStorage.getItem("token"), data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error("Passwords don't match");
    if (pw.newPassword.length < 6) return toast.error("Min 6 characters");
    setPwLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword:pw.currentPassword, newPassword:pw.newPassword });
      toast.success("Password changed!");
      setPw({ currentPassword:"", newPassword:"", confirm:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setPwLoading(false); }
  };

  const inp = "w-full bg-cream border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-ink transition-all font-sans";
  const lbl = "block text-xs font-bold text-ink uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-coral" />
            <span className="text-xs font-bold text-coral-dark uppercase tracking-wider">Account</span>
          </div>
          <h1 className="font-display font-black text-3xl text-ink">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* User Card */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl ${c} flex items-center justify-center text-white font-black text-3xl flex-shrink-0`}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-ink">{user?.name}</h2>
            <p className="text-sm text-ink-muted">{user?.email}</p>
            {user?.bio && <p className="text-sm text-ink-soft mt-1 leading-relaxed">{user.bio}</p>}
            <span className={`inline-block mt-2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              user?.role==="admin" ? "bg-ink text-white" : "bg-cream border border-border text-ink-muted"
            }`}>
              {user?.role==="admin" ? "★ Admin" : "User"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["profile","password"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                tab===t ? "bg-ink text-white" : "bg-white border border-border text-ink-muted hover:border-ink hover:text-ink"
              }`}>
              {t==="profile" ? "Edit Profile" : "Change Password"}
            </button>
          ))}
        </div>

        {tab==="profile" && (
          <form onSubmit={handleUpdate} className="bg-white border border-border rounded-2xl p-6 space-y-5">
            <div>
              <label className={lbl}>Full Name</label>
              <input className={inp} value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name:e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Bio</label>
              <textarea className={`${inp} resize-none`} rows={3} value={form.bio}
                placeholder="Tell something about yourself..."
                onChange={(e) => setForm((p) => ({ ...p, bio:e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Email <span className="text-ink-faint font-normal normal-case">(cannot change)</span></label>
              <input className={`${inp} opacity-50 cursor-not-allowed`} value={user?.email} disabled />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all">
              {loading ? "Saving..." : "Save Changes →"}
            </button>
          </form>
        )}

        {tab==="password" && (
          <form onSubmit={handlePassword} className="bg-white border border-border rounded-2xl p-6 space-y-5">
            <div>
              <label className={lbl}>Current Password</label>
              <input type="password" className={inp} value={pw.currentPassword}
                onChange={(e) => setPw((p) => ({ ...p, currentPassword:e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>New Password</label>
              <input type="password" className={inp} value={pw.newPassword}
                onChange={(e) => setPw((p) => ({ ...p, newPassword:e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Confirm New Password</label>
              <div className="relative">
                <input type="password" className={inp} value={pw.confirm}
                  onChange={(e) => setPw((p) => ({ ...p, confirm:e.target.value }))} />
                {pw.confirm.length > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    {pw.newPassword===pw.confirm ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>
            <button type="submit" disabled={pwLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-ink hover:bg-ink/80 disabled:opacity-60 transition-all">
              {pwLoading ? "Changing..." : "Change Password →"}
            </button>
          </form>
        )}

        <button onClick={() => { logout(); navigate("/"); }}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}