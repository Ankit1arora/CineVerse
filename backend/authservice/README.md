# CineVerse Authentication Service - Quick Reference

## ✨ Project Overview
A simple Spring Boot microservice that handles user authentication, authorization, and JWT-based security for the CineVerse movie theater application.

## 🚀 Quick Start

### 1. Create PostgreSQL Database
```bash
psql -U postgres
CREATE DATABASE authservice_db;
GRANT ALL PRIVILEGES ON DATABASE authservice_db TO postgres;
\q
```

### 2. Update Database Credentials
Edit `src/main/resources/application.properties`:
- Change `spring.datasource.password` to your PostgreSQL password

### 3. Run Application
```bash
mvn clean install
mvn spring-boot:run
```

Application runs on: **http://localhost:8080**

---

## 📝 File Structure Explanation

### 🔐 **Entity Layer** (Database Models)
- **User.java**: Database table with fields (id, name, email, password, role)
- **UserRole.java**: Enum defining USER and ADMIN roles

### 📤 **DTO Layer** (Data Transfer)
- **RegisterRequest.java**: Contains registration data (name, email, password, role)
- **LoginRequest.java**: Contains login data (email, password)
- **AuthResponse.java**: Response sent to client (token, message, role)

### 💾 **Repository Layer** (Database Access)
- **UserRepository.java**: JPA repository for User queries
  - Methods: `findByEmail()`, `existsByEmail()`

### ⚙️ **Service Layer** (Business Logic)
- **AuthService.java**: Handles registration and login logic
  - `register()`: Create new user with BCrypt password
  - `login()`: Verify credentials and generate JWT token

### 🛡️ **Security Layer** (JWT & Authentication)
- **JwtUtil.java**: JWT token operations
  - `generateToken()`: Create JWT with email and role
  - `validateToken()`: Verify token signature and expiration
  - `getEmailFromToken()`: Extract email from token
  - `getRoleFromToken()`: Extract role from token
  
- **JwtAuthenticationFilter.java**: Filter that validates JWT on each request
  - Intercepts requests
  - Extracts and validates JWT token
  - Sets authentication in SecurityContext

### ⚙️ **Configuration Layer**
- **SecurityConfig.java**: Spring Security configuration
  - Defines protected/public endpoints
  - Configures BCrypt password encoder
  - Registers JWT filter
  - Sets stateless session management

### 🌐 **Controller Layer** (API Endpoints)
- **AuthController.java**: REST endpoints
  - `POST /auth/register`: Register new user
  - `POST /auth/login`: Login and get JWT
  - `GET /auth/public/test`: Public endpoint
  - `GET /auth/protected/test`: Protected endpoint
  - `GET /auth/admin/test`: Admin-only endpoint
  - `GET /auth/user/test`: User-only endpoint

### 🎯 **Main Application**
- **AuthServiceApplication.java**: Spring Boot entry point

---

## 📡 API Endpoints

### Public (No JWT Required)
```
POST   /auth/register          → Register new user
POST   /auth/login             → Login and get JWT token
GET    /auth/public/test       → Public test endpoint
```

### Protected (JWT Required)
```
GET    /auth/protected/test    → Requires any valid JWT
GET    /auth/admin/test        → Requires ADMIN role
GET    /auth/user/test         → Requires USER role
```

---

## 🧪 Quick Test Examples

### 1. Register User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ankit",
    "email": "ankit@gmail.com",
    "password": "123456",
    "role": "USER"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ankit@gmail.com",
    "password": "123456"
  }'
```

Response includes JWT token. Copy it.

### 3. Access Protected Endpoint
```bash
curl -X GET http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer <PASTE_JWT_TOKEN_HERE>"
```

### 4. Try Admin Endpoint with User Token
```bash
curl -X GET http://localhost:8080/auth/admin/test \
  -H "Authorization: Bearer <USER_JWT_TOKEN>"
```
Returns: `403 Forbidden` (Expected - user doesn't have ADMIN role)

---

## 🔑 Key Concepts

### BCrypt Password Encoding
- **What**: One-way hashing algorithm
- **Why**: Can't reverse hash to get original password
- **How**: `passwordEncoder.encode()` for saving, `passwordEncoder.matches()` for verification

### JWT Token Structure
```
Header.Payload.Signature

Example: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmtpdEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiJ9.xyz...

- Header: Algorithm used (HS256)
- Payload: Subject (email), Role, Expiration time
- Signature: Created with secret key (only server knows)
```

### Role-Based Access Control (RBAC)
- **@PreAuthorize("hasRole('ADMIN')")**: Only ADMIN can access
- **@PreAuthorize("hasRole('USER')")**: Only USER can access
- Returns 403 Forbidden if role doesn't match

### Stateless Authentication
- No session stored on server
- All info in JWT token
- Easy to scale horizontally
- Perfect for microservices

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Database connection error | Ensure PostgreSQL is running and credentials are correct |
| Port 8080 already in use | Change server.port in application.properties |
| Invalid JWT token | Ensure token is prefixed with "Bearer " in Authorization header |
| Email already exists | Use different email for testing |
| 403 Forbidden on endpoint | Check if JWT token has required role |

---

## 📚 Configuration Files

### application.properties (Key Settings)
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/authservice_db
spring.datasource.username=postgres
spring.datasource.password=password

# JWT
app.jwt.secret=mySecretKeyForJWTTokenGenerationChangeMeInProduction12345678
app.jwt.expiration=86400000  # 24 hours in milliseconds

# JPA
spring.jpa.hibernate.ddl-auto=update  # Auto-create tables
```

### pom.xml (Dependencies)
```xml
Spring Boot Web, Security, Data JPA
PostgreSQL Driver
JWT Library (JJWT)
Lombok (Reduces boilerplate)
```

---

## 📖 For College Viva/Project Explanation

### What is Authentication?
"It's the process of verifying that a user is who they claim to be. In our project, we verify identity through email and password."

### What is Authorization?
"After authentication, authorization checks what the user is allowed to do. For example, only ADMIN users can access admin endpoints."

### Why JWT?
"JWT tokens are stateless - server doesn't need to store session data. This makes our API scalable and perfect for microservices. Each request includes all info (email, role) in the token."

### Why BCrypt for Passwords?
"BCrypt is a one-way hashing algorithm. Even if someone gets the database, they can't get original passwords. It's also very slow to compute, making brute-force attacks impractical."

### Architecture Flow
```
1. User sends email + password to /auth/login
   ↓
2. AuthService checks if user exists and password matches
   ↓
3. JwtUtil generates JWT token containing email and role
   ↓
4. Client receives token and sends it in Authorization header
   ↓
5. JwtAuthenticationFilter intercepts request, validates token
   ↓
6. SecurityContext set with user info
   ↓
7. Controller endpoint executes with authenticated user
```

---

## 🎓 Learning Resources

- **Spring Security Official Docs**: https://spring.io/projects/spring-security
- **JWT Introduction**: https://jwt.io/introduction
- **BCrypt Algorithm**: https://en.wikipedia.org/wiki/Bcrypt
- **Spring Boot Security**: https://spring.io/guides/gs/securing-web/

---

## ⭐ Features Implemented

✅ User Registration with email uniqueness  
✅ User Login with password verification  
✅ JWT Token Generation with expiration  
✅ BCrypt Password Encryption  
✅ Role-Based Access Control (USER/ADMIN)  
✅ Stateless Authentication  
✅ PostgreSQL Integration  
✅ Input Validation (Email, Password)  
✅ Error Handling with proper HTTP status codes  
✅ CORS Support for Frontend  

---

## 🚀 Future Enhancements

1. **Email Verification**: Send confirmation email after registration
2. **Refresh Tokens**: Allow getting new JWT without re-login
3. **Token Blacklist**: Invalidate tokens on logout
4. **Password Reset**: Forgot password functionality
5. **Two-Factor Authentication**: Extra security layer
6. **Rate Limiting**: Prevent brute-force attacks
7. **Audit Logging**: Track all auth attempts

---

## 📞 Need Help?

Refer to:
1. `SETUP_AND_TESTING_GUIDE.md` - Complete setup and Postman testing guide
2. Code comments - Each file has detailed explanations
3. Controller methods - Include example request/response formats

---

**Created for CineVerse - A Movie Theater Management System**
