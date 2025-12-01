# EduBridge --- Online Learning Platform (MERN Stack)

EduBridge is a full-stack online learning platform built with: -
**Frontend:** React + Vite + TailwindCSS - **Backend:** Node.js +
Express - **Database:** MongoDB - **Authentication:** JWT + Refresh
Tokens - **Payments:** Paystack / Stripe - **Real-Time:** Socket.io

------------------------------------------------------------------------

## 🚀 Features

-   Role-based authentication (Admin, Teacher, Student)
-   Course creation & publishing
-   Student enrollment
-   Secure payments
-   Admin analytics dashboard
-   Real-time chat
-   Public course browsing
-   Protected dashboards

------------------------------------------------------------------------

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

``` bash
git clone https://github.com/YOUR-REPO/edubridge.git
cd edubridge
```

------------------------------------------------------------------------

# ✅ 2. **API Documentation**

``` md
# EduBridge API Documentation

Base URL:
http://localhost:5000/api

---

## 🔐 Authentication

### POST /auth/login
Login user
```json
{
  "email": "user@email.com",
  "password": "password"
}
```


    ---

    # ✅ 3. **User Guide**

    ```md
    # EduBridge User Guide

    ---

    ## 👤 Student Guide
    1. Open the website
    2. Browse courses on the Home page
    3. Click on a course to view details
    4. Register / Login
    5. Enroll in course
    6. Make payment
    7. Access learning content

    ---

    ## 👨‍🏫 Teacher Guide
    1. Login as a teacher
    2. Go to Teacher Dashboard
    3. Create a course
    4. Upload lessons
    5. Publish course
    6. Track student enrollments

    ---

    ## 👑 Admin Guide
    1. Login as Admin
    2. Access Admin Dashboard
    3. View system statistics
    4. Manage users
    5. Manage courses
    6. View payments & revenue
    7. Promote/demote users
    8. Delete invalid users or courses

    ---

    ## 🔐 Security
    - All dashboards are protected
    - Token-based authentication
    - Secure payments only

------------------------------------------------------------------------

# EduBridge Technical Architecture

------------------------------------------------------------------------

## 🏗 System Architecture

``` text
Frontend (React + Vite)
        ↓
   API Requests (Axios)
        ↓
Backend (Node.js + Express)
        ↓
Database (MongoDB Atlas)
```

------------------------------------------------------------------------

## 🔐 Authentication Flow

1.  User logs in
2.  Backend issues Access Token + Refresh Token
3.  Access token stored in localStorage
4.  Refresh token stored in HTTP-only cookie
5.  Auto refresh on 401 errors

------------------------------------------------------------------------

## 🧑‍💼 Role-Based Access Control

-   Admin → Full system access
-   Teacher → Course management
-   Student → Enrollment & learning

------------------------------------------------------------------------

## 💳 Payment Flow

1.  Student initiates payment
2.  Paystack/Stripe processes payment
3.  Webhook confirms transaction
4.  Enrollment activated automatically

------------------------------------------------------------------------

## 📡 Real-Time System

-   Socket.io used for:
    -   Live chat
    -   Notifications
    -   Real-time updates

------------------------------------------------------------------------

## ⚙ Tech Stack Summary

  Layer      Technology
  ---------- -----------------------
  Frontend   React, Vite, Tailwind
  Backend    Node.js, Express
  Database   MongoDB
  Auth       JWT
  Payments   Paystack / Stripe
  Realtime   Socket.io
  Hosting    Render

------------------------------------------------------------------------

✅ Fully modular\
✅ Secure API\
✅ Scalable for thousands of users\
✅ Production-ready

------------------------------------------------------------------------

## Sreenshot and Video

`<img width="1361" height="607" alt="image" src="https://github.com/user-attachments/assets/f20752ef-c30d-4062-82e9-44d8bdfff0b7"/>`{=html}

------------------------------------------------------------------------

### ✅ Demo Video (GitHub Supported Preview)

[![EduBridge Demo
Video](https://img.youtube.com/vi/ac11bJmZWIo/maxresdefault.jpg)](https://youtu.be/ac11bJmZWIo)

------------------------------------------------------------------------

## Frontend URL

https://mern-final-project-puritized-1.onrender.com/

------------------------------------------------------------------------

## Demo Login

1.  ## Admin

    User: admin\
    Password: password123

2.  ## Teacher

    User: teacher\
    Password: password123

3.  ## Student

    User: student\
    Password: password123
