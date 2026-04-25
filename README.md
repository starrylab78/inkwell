# 🖋 Inkwell — Full-Stack Blog Application

A production-ready blogging platform built with React, Node.js, Express, and MongoDB.

---

## ✨ Features

- **Authentication** — JWT-based registration & login with bcrypt password hashing
- **CRUD Posts** — Create, read, update, and delete blog posts
- **Authorization** — Only authors can edit or delete their own posts
- **Public Access** — Anyone can read all posts without an account
- **Responsive UI** — Editorial aesthetic, mobile-friendly design
- **Pagination** — Browse posts page by page
- **Tag Support** — Categorize posts with tags
- **Read Time** — Auto-calculated reading time per post

---

## 📁 Project Structure

```
inkwell/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── PostCard.js
    │   │   └── PostForm.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── CreatePost.js
    │   │   ├── EditPost.js
    │   │   └── ViewPost.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Clone / Download the Project

```bash
cd inkwell
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts (paginated) | No |
| GET | `/api/posts/:id` | Get a single post | No |
| GET | `/api/posts/my-posts` | Get logged-in user's posts | Yes |
| POST | `/api/posts` | Create a new post | Yes |
| PUT | `/api/posts/:id` | Update a post (author only) | Yes |
| DELETE | `/api/posts/:id` | Delete a post (author only) | Yes |

---

## 🔐 Authentication Flow

1. User registers or logs in → server returns a JWT token
2. Token is stored in `localStorage`
3. All protected API requests include the token in the `Authorization: Bearer <token>` header
4. The `protect` middleware verifies the token on protected routes

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Styling | Custom CSS (editorial theme) |

---

## 📦 Deploying to Production

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables in the platform dashboard
2. Use `npm start` as the start command

### Frontend (e.g., Vercel, Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build` for the production build
3. Deploy the `build/` folder

---

## 📄 License

MIT — free to use, modify, and distribute.
