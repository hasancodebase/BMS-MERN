import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/blog/Home";
import BlogList from "./pages/blog/BlogList";
import SingleBlog from "./pages/blog/SingleBlog";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import CreateBlog from "./pages/admin/CreateBlog";
import EditBlog from "./pages/admin/EditBlog";
import MyBlogs from "./pages/user/MyBlogs";
import Profile from "./pages/user/Profile";

const Protected = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ style: { background: "#18181f", color: "#f0f0f8", border: "1px solid rgba(255,255,255,0.08)" } }} />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/blogs" element={<Layout><BlogList /></Layout>} />
          <Route path="/blogs/:slug" element={<Layout><SingleBlog /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected adminRequired><Dashboard /></Protected>} />
          <Route path="/create-blog" element={<Protected><CreateBlog /></Protected>} />
          <Route path="/edit-blog/:id" element={<Protected><EditBlog /></Protected>} />
          <Route path="/my-blogs" element={<Protected><Layout><MyBlogs /></Layout></Protected>} />
          <Route path="/profile" element={<Protected><Layout><Profile /></Layout></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
