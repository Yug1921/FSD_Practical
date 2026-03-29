<img width="1918" height="1078" alt="Screenshot 2026-03-29 231229" src="https://github.com/user-attachments/assets/35c40a06-925f-43ba-9e86-5164b27186e9" /># 🎓 Student Course Registration System

A full-stack web application that allows students to register, login, browse available courses, and enroll in courses for a semester.

This project demonstrates a complete **MERN-style architecture** using **Node.js, Express.js, MongoDB, and a static frontend (HTML/CSS/JS)**.

---

## 🚀 Features

- Student Registration & Login (JWT Authentication)
- Secure Password Handling
- Browse Available Courses
- Enroll in Courses
- View Enrolled Courses Dashboard
- Protected API Routes
- MongoDB Database Integration
- REST API Architecture

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- dotenv

---

## 📂 Project Structure

Student_Registration
│
├── backend
│ ├── config
│ │ ├── db.js
│ │ └── seedCourses.js
│ │
│ ├── middleware
│ │ └── auth.js
│ │
│ ├── models
│ │ ├── Student.js
│ │ ├── Course.js
│ │ └── Enrollment.js
│ │
│ ├── routes
│ │ ├── auth.js
│ │ ├── courses.js
│ │ └── enrollments.js
│ │
│ ├── server.js
│ └── .env
│
├── frontend
│ ├── css
│ │ └── styles.css
│ │
│ ├── javascript
│ │ ├── auth.js
│ │ ├── courses.js
│ │ └── enrollments.js
│ │
│ ├── index.html
│ ├── dashboard.html
│ └── courses.html
│
├── package.json
├── .gitignore
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

---

### 2️⃣ Install Dependencies
npm install

---

### 3️⃣ Create Environment File

Create `.env` inside **backend folder**
backend/.env

Add:                                                                
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

In My Case It is: 
MONGO_URI=mongodb+srv://yugTest:yug12345@cluster0-backend-projec.utixa5m.mongodb.net/
JWT_SECRET=studentRegistrationSecret2026
PORT=5000

---

### 4️⃣ Add Sample Courses (Important)

Run seed script: node backend/config/seedCourses.js

---

### 5️⃣ Run Backend Server
npm run dev

Server will start at: http://localhost:5000

---

### 6️⃣ Run Frontend

Open: VS Code Live Server
Frontend runs at: http://127.0.0.1:5500/frontend/index.html

---

## 📸 Screenshots

### 🔐 Login Page
Add screenshot:
<img width="1918" height="1078" alt="image" src="https://github.com/user-attachments/assets/3754009e-360c-4c8a-8155-7814451377e4" />



---

### 📝 Registration Page
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/d6de812e-a99a-41df-94a3-864a975ac0e4" />

---

### 📚 Available Courses
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ffaab2a3-4379-43c5-8790-ccbb4ba92baf" />

---

### 📊 Dashboard (Enrolled Courses)
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2c745008-5407-43fd-9fae-48a599f55611" />

---

## 🔄 Application Flow

1. User registers account
2. Password stored securely in MongoDB
3. User logs in
4. JWT token generated
5. Token stored in browser localStorage
6. User can browse courses
7. User enrolls in courses
8. Dashboard displays enrolled courses

---

## 🔑 API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | /api/auth/register | Register new student |
| POST | /api/auth/login | Login student |
| GET | /api/auth/profile | Get student profile |

---

### Course Routes

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get course details |

---

### Enrollment Routes

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | /api/enrollments | Enroll in course |
| GET | /api/enrollments | Get enrolled courses |
| DELETE | /api/enrollments/:id | Drop course |

---

## 🧪 Testing

Use:

- Postman
- Thunder Client
- Browser DevTools

---

## 📌 Important Notes

- Ensure MongoDB Atlas IP access is enabled
- Ensure JWT_SECRET is defined in .env
- node_modules folder is ignored in Git
- CORS enabled for frontend-backend communication

---

## 👨‍💻 Author

Yug Upadhyay

---

## 📜 License

This project is for educational purposes.



