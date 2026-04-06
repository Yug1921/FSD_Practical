# 🎓 Student Course Registration System

A full-stack web application that allows students to register, login, browse available courses, and enroll in courses for a semester.

This project demonstrates a complete **MERN-style architecture** using **Node.js, Express.js, MongoDB, and a static frontend (HTML/CSS/JS)**.

---

## 🚀 Features

- Student Registration & Login (JWT Authentication)
- Secure Password Handling (bcryptjs)
- Browse & Search Available Courses
- Enroll in / Drop Courses
- View Enrolled Courses Dashboard
- Protected API Routes (JWT Middleware)
- Payment Mockup (process, history, status)
- Image Upload with Multer (type & size validation)
- MongoDB Database Integration
- REST API Architecture
- Input Validation & Error Handling

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
- MongoDB / Mongoose
- JWT Authentication (jsonwebtoken)
- bcryptjs (password hashing)
- Multer (image uploads)
- dotenv

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Yug1921/Student_Course_Registration_App.git
cd Student_Course_Registration_App
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create Environment File

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 4️⃣ Add Sample Courses (Important)

```bash
node backend/config/seedCourses.js
```

---

### 5️⃣ Run Backend Server

```bash
npm run dev
```

Server will start at: `http://localhost:5000`

---

### 6️⃣ Run Frontend

Open with VS Code Live Server or access directly at:
`http://localhost:5000`

---

## 🚀 Deployment

### Render / Railway

1. Push to GitHub
2. Connect repository in Render/Railway
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
4. The `Procfile` is included for automatic startup:
   ```
   web: node backend/Server.js
   ```

---

## 📸 Screenshots

### 🔐 Login Page
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

1. User registers account (name, email, password validated)
2. Password hashed and stored securely in MongoDB
3. User logs in → JWT token generated (7-day expiry)
4. Token stored in browser localStorage
5. Token sent in `Authorization: Bearer <token>` header for protected routes
6. User can browse and search courses
7. User enrolls in / drops courses
8. User processes mock payments
9. User uploads profile/course images
10. Dashboard displays enrolled courses

---

## 🔑 API Endpoints

### Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new student |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/profile` | Yes | Get logged-in student profile |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login/Register Success Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "studentId": "STU123456",
  "token": "<jwt_token>"
}
```

---

### Course Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | Yes | Get all courses (supports `?search=` and `?department=`) |
| GET | `/api/courses/:id` | Yes | Get course by ID |
| POST | `/api/courses` | Yes | Create a course (admin use) |

---

### Enrollment Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/enrollments` | Yes | Enroll in a course |
| GET | `/api/enrollments` | Yes | Get my enrolled courses |
| DELETE | `/api/enrollments/:id` | Yes | Drop a course |

**Enroll Request Body:**
```json
{
  "courseId": "<course_mongo_id>"
}
```

---

### Payment Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/process` | Yes | Process a mock payment |
| GET | `/api/payments/history` | Yes | Get payment history |
| GET | `/api/payments/status/:transactionId` | Yes | Get payment status |

**Process Payment Request Body:**
```json
{
  "amount": 150,
  "description": "Spring semester registration fee",
  "cardNumber": "4111111111111111"
}
```

**Process Payment Success Response:**
```json
{
  "message": "Payment processed successfully",
  "status": "success",
  "transactionId": "TXN16849201234567",
  "amount": 150,
  "currency": "USD",
  "cardLastFour": "1111"
}
```

> **Note:** Cards starting with `0000` will simulate a payment failure (status 402).

---

### Upload Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | Yes | Upload an image file |
| GET | `/uploads/:filename` | No | Serve an uploaded image |

**Upload Request:** `multipart/form-data` with field `image` (jpeg/jpg/png/gif/webp, max 5MB)

**Upload Success Response:**
```json
{
  "message": "Image uploaded successfully",
  "filename": "img-1234567890-123456789.jpg",
  "url": "/uploads/img-1234567890-123456789.jpg",
  "size": 204800,
  "mimetype": "image/jpeg"
}
```

---

## 🧪 Postman Testing

A Postman collection is included at `postman_collection.json`.

**To use:**
1. Import `postman_collection.json` in Postman
2. Set collection variable `baseUrl` to `http://localhost:5000`
3. Run the **Register** request first — the token is saved automatically
4. All subsequent requests use the saved token

**Test scenarios included:**
- ✅ Register with valid data → 201
- ❌ Register with invalid email/short password → 400
- ✅ Login with correct credentials → 200 + JWT
- ❌ Login with wrong password → 401
- ✅ Get profile with valid token → 200
- ✅ Get all courses → 200 array
- ✅ Enroll in course → 201
- ❌ Enroll in full/already-enrolled course → 400
- ✅ Payment success (card not starting with 0000) → 201
- ❌ Payment failure (card starting with 0000) → 402
- ✅ Get payment history → 200 array
- ✅ Upload valid image → 201
- ❌ Upload with no file → 400

---

## 📌 Important Notes

- Ensure MongoDB Atlas IP access is enabled
- Ensure `JWT_SECRET` is defined in `backend/.env`
- `node_modules` folder is ignored in Git
- Uploaded files are stored in `backend/uploads/` (gitignored)
- CORS is enabled for frontend-backend communication

---

## 👨‍💻 Author

Yug Upadhyay

---

## 📜 License

This project is for educational purposes.

