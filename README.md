# Task Manager Web Application

A full-stack Task Manager application built with Node.js, Express, MongoDB, and React (Vite). Features JWT authentication, RBAC (Role-Based Access Control), and SMTP email integration.

![Task Manager](screenshots/dashboard.png)

## 🚀 Features

- **User Authentication**: Register, login with JWT tokens
- **Task Management**: Create, read, update, delete tasks
- **RBAC**: User and Admin roles with different permissions
- **Email Notifications**: Welcome email on registration, task completion notifications
- **Responsive UI**: Modern, premium light theme design
- **Filtering & Sorting**: Filter tasks by status, sort by date

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Email**: Nodemailer (SendGrid/Mailgun/Postmark compatible)
- **Security**: Helmet, CORS, express-rate-limit

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS (Premium Light Theme)

## 📁 Project Structure

```
task-manager/
├── server/                     # Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── taskController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── validateMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── task.routes.js
│   │   ├── services/
│   │   │   └── email.service.js
│   │   ├── scripts/
│   │   │   └── seedAdmin.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── client/                     # Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── tasks.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── screenshots/               # Screenshot placeholders
├── README.md
└── .gitignore
```

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# SMTP Configuration (SendGrid example)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Email Settings
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Task Manager App

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
# API URL (for production)
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- (Optional) SendGrid/Mailgun/Postmark account for emails

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI and other settings
# IMPORTANT: Replace the MONGODB_URI with your MongoDB Atlas connection string

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# (Optional) Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Create Admin User (Optional)

```bash
cd server
npm run seed:admin
```

This creates an admin user:

- **Email**: admin@taskmanager.com
- **Password**: admin123

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "token": "eyJhbGciOi..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOi..."
  }
}
```

### User Endpoints (Requires Authentication)

#### Get Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

### Task Endpoints (Requires Authentication)

#### Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "dueDate": "2024-12-31"
}
```

#### Get All Tasks

```http
GET /api/tasks
Authorization: Bearer <token>
```

**Query Parameters**:

- `status` (optional): `true` or `false` - filter by completion status
- `sort` (optional): `dueDate`, `-dueDate`, `createdAt`, `-createdAt`

Example: `GET /api/tasks?status=false&sort=dueDate`

#### Get Task by ID

```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": true
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### Error Responses

| Status | Description                          |
| ------ | ------------------------------------ |
| 400    | Validation error / Bad request       |
| 401    | Unauthorized (missing/invalid token) |
| 403    | Forbidden (insufficient permissions) |
| 404    | Resource not found                   |
| 500    | Internal server error                |

## 🔐 RBAC (Role-Based Access Control)

### Roles

- **user**: Default role for all new registrations
- **admin**: Has elevated privileges

### Permissions

| Action           | User | Admin |
| ---------------- | ---- | ----- |
| View own tasks   | ✅   | ✅    |
| Create tasks     | ✅   | ✅    |
| Edit own tasks   | ✅   | ✅    |
| Delete own tasks | ✅   | ✅    |
| View any task    | ❌   | ✅    |
| Edit any task    | ❌   | ✅    |
| Delete any task  | ❌   | ✅    |

## 📧 Email Integration

The application uses Nodemailer with support for:

- **SendGrid**
- **Mailgun**
- **Postmark**
- Any SMTP provider

### Email Features

1. **Welcome Email**: Sent automatically after user registration
2. **Task Completed Email**: Sent when a task is marked as complete

### Development Mode

When SMTP is not configured, emails are logged to the console for development purposes.

## 📸 Screenshots

| Page                                    | Description                           |
| --------------------------------------- | ------------------------------------- |
| ![Login](screenshots/login.png)         | Login page with form validation       |
| ![Register](screenshots/register.png)   | Registration page                     |
| ![Dashboard](screenshots/dashboard.png) | Task dashboard with stats and filters |
| ![Profile](screenshots/profile.png)     | User profile page                     |

## 🌐 Deployment

### Deployment on Render

#### Backend

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
4. Add environment variables from `server/.env.example`

#### Frontend

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL + `/api`

### Deployed URLs (Placeholders)

- **Backend URL**: `https://your-backend.onrender.com`
- **Frontend URL**: `https://your-frontend.onrender.com`

## 🧪 Testing

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get Tasks (replace TOKEN)
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Task Manager Web Application - Full Stack Project
