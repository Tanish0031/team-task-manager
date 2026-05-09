# 📋 Team Task Manager

A full-stack MERN application for managing projects and tasks with role-based access control (Admin/Member).

## 🌐 Live Demo
🔗 [https://frontend-production-ff73.up.railway.app](https://frontend-production-ff73.up.railway.app)

## 🚀 Features
- 🔐 Authentication (Signup/Login with JWT)
- 📁 Project & Team Management
- ✅ Task Creation, Assignment & Status Tracking
- 📊 Kanban Board (Todo / In Progress / Done)
- 👑 Role-Based Access Control (Admin / Member)
- 📈 Dashboard with stats (Total Projects, Tasks, Overdue)

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Railway) |
| Auth | JWT + bcrypt |
| Deployment | Railway |

## 👑 Admin vs Member Access

| Feature | Member | Admin |
|---|---|---|
| Create Project | ✅ | ✅ |
| Delete own project | ✅ | ✅ |
| Delete any project | ❌ | ✅ |
| Add members to project | ❌ | ✅ |
| Create tasks | ✅ | ✅ |
| Move task status | ✅ | ✅ |
| Delete tasks | ❌ | ✅ |
| View all projects | ❌ | ✅ |
| Gold Admin badge | ❌ | ✅ |


````md
## 🗂️ Project Structure

```
team-task-manager/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/ # Navbar
        ├── context/    # Auth context
        ├── pages/      # Login, Register, Dashboard, Projects
        └── utils/      # Axios API config
```
````

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/taskmanager" > .env
echo "JWT_SECRET=supersecretjwtkey123" >> .env
echo "PORT=5000" >> .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/auth/find | Find user by email |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get single project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/projects/:id/members | Add member |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## 🚢 Deployment
Deployed on [Railway](https://railway.app):
- ✅ MongoDB service
- ✅ Backend (Node/Express) service  
- ✅ Frontend (React/Vite) service

## 📦 Submission
- 🔗 Live URL: [https://frontend-production-ff73.up.railway.app](https://frontend-production-ff73.up.railway.app)
- 💻 GitHub: [https://github.com/Tanish0031/team-task-manager](https://github.com/Tanish0031/team-task-manager)
