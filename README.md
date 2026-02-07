# IT342 G4 Sanchez - User Authentication & Profile Management

A full-stack web application for user registration, authentication, and profile management using Spring Boot backend and Next.js frontend.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Frontend Components](#frontend-components)
- [Backend Endpoints](#backend-endpoints)

## 🎯 Project Overview

This is a complete user authentication system with JWT token-based security, allowing users to:
- Register with email and password
- Login and receive authentication tokens
- View and edit their profile (bio, avatar, cover image)
- Secure logout functionality

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 4.0.2
- **Language:** Java 17
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens) with jjwt
- **ORM:** Spring Data JPA
- **Build Tool:** Maven

### Frontend
- **Framework:** Next.js 16.1.6
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS 4 + PostCSS
- **Language:** TypeScript 5
- **Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **State Management:** React Hooks

## 📁 Project Structure

```
IT342_G4_Sanchez_Lab1/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/backend/backend/
│   │   ├── BackendApplication.java   # Main entry point
│   │   ├── config/
│   │   │   └── SecurityConfig.java   # Spring Security configuration
│   │   ├── controller/
│   │   │   └── AuthController.java   # Auth endpoints (register, login)
│   │   ├── dto/
│   │   │   └── UserResponse.java     # User data transfer object
│   │   ├── entity/
│   │   │   └── User.java             # User JPA entity
│   │   ├── repository/
│   │   │   └── UserRepository.java   # Database queries
│   │   ├── security/
│   │   │   └── CookieJwtAuthenticationFilter.java  # JWT filter
│   │   └── service/
│   │       ├── AuthService.java      # Authentication logic
│   │       ├── JwtService.java       # JWT token handling
│   │       └── UserService.java      # User business logic
│   ├── pom.xml                       # Maven dependencies
│   └── application.properties        # Database & server config
│
├── web/                              # Next.js Frontend
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── register/page.tsx     # Registration page
│   │   ├── profile/page.tsx          # User profile page
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── lib/
│   │   ├── api.ts                    # API client utilities
│   │   └── api/
│   │       └── profile.ts            # Profile API calls
│   ├── types/
│   │   ├── auth.ts                   # Auth type definitions
│   │   └── profile.ts                # Profile type definitions
│   ├── components/
│   │   ├── footer.tsx
│   │   └── background-blobs.tsx
│   ├── package.json                  # NPM dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── next.config.ts                # Next.js config
│   └── tailwind.config.ts            # Tailwind CSS config
│
└── mobile/                           # Mobile app (placeholder)
```

## 📦 Prerequisites

- **Java 17** or higher
- **Node.js 18+** or higher
- **npm** or **yarn**
- **MySQL 8.0+**
- **Maven 3.8+**

## 🚀 Installation & Setup

### 1. Backend Setup

#### a. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE user_auth_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON user_auth_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

#### b. Update Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_auth_db
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080
```

#### c. Build Backend

```bash
cd backend
mvn clean install
```

### 2. Frontend Setup

```bash
cd web
npm install
```

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Terminal 2: Start Frontend

```bash
cd web
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "bio": null,
    "coverImage": null
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
```

### User Profile Endpoints

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "avatar": "https://...",
  "bio": "User bio",
  "coverImage": "https://...",
  "createdAt": "2024-02-07T10:00:00"
}
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "bio": "Updated bio",
  "avatar": "https://...",
  "coverImage": "https://..."
}

Response: 200 OK
{ ... updated user data ... }
```

#### Upload Image
```
POST /api/users/profile/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

File: <image file>
type: avatar | coverImage

Response: 200 OK
{
  "url": "https://..."
}
```

## ✨ Features

### 🔐 Authentication
- [x] User registration with email validation
- [x] Login with JWT token generation
- [x] Secure password handling
- [x] HttpOnly cookie-based token storage
- [x] CORS configuration for local frontend

### 👤 Profile Management
- [x] View user profile with avatar and bio
- [x] Cover image display
- [x] User information (email, username, join date)
- [x] Responsive profile layout
- [x] Edit profile functionality (UI ready)
- [x] Logout with proper session cleanup

### 🎨 UI/UX
- [x] Modern dark theme with gradients
- [x] Responsive design (mobile, tablet, desktop)
- [x] Loading states and error handling
- [x] Smooth transitions and animations
- [x] Icon integration with Lucide React
- [x] Image optimization with Next.js Image

## 🧩 Frontend Components

### Pages

**Login ([app/(public)/login/page.tsx](web/app/(public)/login/page.tsx))**
- Email/password login form
- Error messages
- Registration link

**Register ([app/(public)/register/page.tsx](web/app/(public)/register/page.tsx))**
- Email, username, password input fields
- Form validation
- Login page link

**Profile ([app/profile/page.tsx](web/app/profile/page.tsx))**
- User profile display
- Cover image with edit option
- Avatar with initial fallback
- Bio section
- Account information
- Logout button

### API Modules

**API Client ([lib/api.ts](web/lib/api.ts))**
- Centralized API request handler
- Automatic error handling
- Type-safe responses
- Cookie credential support

**Profile API ([lib/api/profile.ts](web/lib/api/profile.ts))**
- `getProfile()` - Fetch user profile
- `updateProfile()` - Update profile data
- `uploadProfileImage()` - Upload images
- `logout()` - User logout

### Type Definitions

**Auth Types ([types/auth.ts](web/types/auth.ts))**
- `AuthUser` - Authenticated user structure
- `AuthResponse` - Login/register response
- `ErrorResponse` - Error response format

**Profile Types ([types/profile.ts](web/types/profile.ts))**
- `ProfileData` - User profile data
- `ProfileUpdateRequest` - Profile update DTO
- `ProfileResponse` - API response format

## ⚙️ Backend Components

### Security
- JWT token generation and validation
- Spring Security configuration
- Cookie-based authentication filter
- CORS enabled for frontend

### Services
- **AuthService** - Registration and login logic
- **UserService** - User CRUD operations
- **JwtService** - JWT token management

### Database
- User entity with all profile fields
- Automatic timestamp management
- Email and username uniqueness constraints

## 🔒 Security Features

- HTTPOnly cookies prevent XSS attacks
- JWT token-based authentication
- Password stored securely
- CORS restricted to localhost:3000
- Input validation on both client and server
- Automatic token refresh capability

## 📝 Environment Variables

### Backend
Set in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_auth_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Frontend
No environment variables needed for local development. API calls default to `http://localhost:8080/api`

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Clear Maven cache: `mvn clean`

### Frontend API calls failing
- Verify backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Ensure cookies are enabled in browser

### Database connection errors
- Verify MySQL service is running
- Check connection string matches your setup
- Ensure user has proper permissions

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [JWT Guide](https://jwt.io/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 👥 Team

- **Course:** IT342
- **Group:** G4
- **Developer:** Sanchez

---

*Last Updated: February 2026*
