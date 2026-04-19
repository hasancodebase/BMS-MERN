import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const gradients = ["from-violet-500 to-indigo-500","from-teal-500 to-cyan-500","from-pink-500 to-rose-500","from-amber-500 to-orange-500"];

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [tab, setTab] = useState("profile");
  const g = gradients[user?.name?.charCodeAt(0) % gradients.length ?? 0];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      login(localStorage.getItem("token"), data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error("Passwords don't match");
    if (passwords.newPassword.length < 6) return toast.error("Password must be 6+ characters");
    setPassLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success("Password changed!");
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setPassLoading(false); }
  };

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all";
  const labelClass = "block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider";

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-white mb-8" style={{ fontFamily:"'Syne',sans-serif" }}>Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center text-white text-3xl font-black flex-shrink-0`}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full ${user?.role === "admin" ? "bg-violet-500/15 text-violet-300" : "bg-white/5 text-gray-400"}`}>
            {user?.role === "admin" ? "★ Admin" : "User"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["profile", "password"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              tab === t ? "text-white" : "bg-white/[0.03] border border-white/[0.07] text-gray-400 hover:text-white"
            }`}
            style={tab === t ? { background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" } : {}}>
            {t === "profile" ? "Edit Profile" : "Change Password"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <form onSubmit={handleUpdate} className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea className={`${inputClass} resize-none`} rows={3} value={form.bio}
              placeholder="Tell something about yourself..."
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={`${inputClass} opacity-50 cursor-not-allowed`} value={user?.email} disabled />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            {loading ? "Saving..." : "Save Changes →"}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {tab === "password" && (
        <form onSubmit={handlePassword} className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" className={inputClass} value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" className={inputClass} value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <input type="password" className={inputClass} value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />
              {passwords.confirm.length > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  {passwords.newPassword === passwords.confirm ? "✅" : "❌"}
                </span>
              )}
            </div>
          </div>
          <button type="submit" disabled={passLoading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-all"
            style={{ background:"linear-gradient(135deg,#7c5cfc,#14b8a6)" }}>
            {passLoading ? "Changing..." : "Change Password →"}
          </button>
        </form>
      )}

      <button onClick={() => { logout(); navigate("/"); }}
        className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all">
        Sign Out
      </button>
    </div>
  );
}