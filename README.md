# BMS-MERN — Blog Management System

![BMS-MERN](https://img.shields.io/badge/MERN-Stack-violet)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-cyan)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)

> A full-stack MERN Blog Management System with JWT authentication, admin dashboard, rich text editor, image upload, comments, likes, and category filtering.

## 🚀 Live Demo
- **Frontend:** Coming soon
- **Backend:** Coming soon

## ✨ Features
- 📝 Create, Edit, Delete blogs with rich text editor
- 🖼 Image upload via Cloudinary
- 🔐 JWT authentication with role-based access
- 👨‍💼 Admin dashboard with stats
- 💬 Comment system
- ❤️ Like system
- 🔍 Search and category filtering
- 📄 Pagination
- 🌙 Dark mode UI
- 📱 Fully responsive

## 🛠 Tech Stack
| Frontend | Backend |
|----------|---------|
| React 18 + Vite | Node.js + Express |
| Tailwind CSS | MongoDB + Mongoose |
| React Router v6 | JWT Authentication |
| React Quill | Multer + Cloudinary |
| React Hot Toast | Nodemailer |
| Axios | Slugify |

## 📁 Project Structure
```
BMS-MERN/
├── client/          # React frontend
│   └── src/
│       ├── api/     # Axios config
│       ├── context/ # Auth context
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/          # Express backend
│   ├── config/      # DB + Cloudinary
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth middleware
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   └── utils/       # Helpers
└── README.md
```

## 🚀 Quick Start

### Server
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

## 📡 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |

### Blogs
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/blogs | Get all blogs |
| GET | /api/blogs/:slug | Get single blog |
| POST | /api/blogs | Create blog |
| PUT | /api/blogs/:id | Update blog |
| DELETE | /api/blogs/:id | Delete blog |
| PATCH | /api/blogs/:id/like | Toggle like |

### Comments
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/comments/:blogId | Get comments |
| POST | /api/comments/:blogId | Add comment |
| DELETE | /api/comments/:id | Delete comment |

## 👨‍💻 Author
**Naeem Hasan** — [@hasancodebase](https://github.com/hasancodebase)

## 📄 License
MIT License
