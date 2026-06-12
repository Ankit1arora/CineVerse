# CineVerse Authentication Service - Complete Setup & Testing Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Postman Testing](#postman-testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Java 21 installed
- Maven 3.8+ installed
- PostgreSQL installed and running
- Postman or Insomnia (for API testing)

**Verify installations:**
```bash
java -version
mvn -version
psql --version
```

---

## Database Setup

### 1. Start PostgreSQL Server
- **Windows**: PostgreSQL should be running as a service
- **Linux**: `sudo service postgresql start`
- **Mac**: `brew services start postgresql`

### 2. Create Database and User

Open PostgreSQL command line:
```bash
psql -U postgres
```

Run these commands:
```sql
-- Create database
CREATE DATABASE authservice_db;

-- Create user (if not exists)
CREATE USER postgres WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE authservice_db TO postgres;

-- Exit
\q
```

### 3. Verify Connection
```bash
psql -U postgres -d authservice_db -h localhost
```

You should see the `authservice_db=#` prompt. Type `\q` to exit.

---

## Project Setup

### 1. Navigate to Project Directory
```bash
cd backend/authservice
```

### 2. Update application.properties
Edit `src/main/resources/application.properties`:

```properties
# Change these values if different from your setup
spring.datasource.username=postgres
spring.datasource.password=password    # Change to your PostgreSQL password
spring.datasource.url=jdbc:postgresql://localhost:5432/authservice_db

# JWT Secret (Change this to a strong key in production)
app.jwt.secret=mySecretKeyForJWTTokenGenerationChangeMeInProduction12345678
```

### 3. Build Project with Maven
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Create tables automatically in PostgreSQL

---

## Running the Application

### Start the Application
```bash
mvn spring-boot:run
```

You should see output like:
```
Tomcat started on port(s): 8080 (http)
AuthServiceApplication started in X.XXX seconds
```

The application is now running at: **http://localhost:8080**

---

## API Endpoints

### Public Endpoints (No JWT Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/public/test` | Test public endpoint |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Required Role | Purpose |
|--------|----------|---------------|---------|
| GET | `/auth/protected/test` | Any authenticated | Test JWT protection |
| GET | `/auth/admin/test` | ADMIN | Admin-only endpoint |
| GET | `/auth/user/test` | USER | User-only endpoint |

---

## Postman Testing

### Step 1: Import Sample Requests

Create a new Postman collection with the following requests:

---

### **Request 1: Register New User (Role: USER)**

**Method:** POST  
**URL:** `http://localhost:8080/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ankit Kumar",
  "email": "ankit@gmail.com",
  "password": "123456",
  "role": "USER"
}
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmtpdEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwMjAyMzAwMCwiZXhwIjoxNzAyMTA5NDAwfQ.abc123...",
  "message": "User registered successfully!",
  "role": "USER"
}
```

---

### **Request 2: Register Admin User (Role: ADMIN)**

**Method:** POST  
**URL:** `http://localhost:8080/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDIwMjMwMDAsImV4cCI6MTcwMjEwOTQwMH0.xyz789...",
  "message": "User registered successfully!",
  "role": "ADMIN"
}
```

---

### **Request 3: Login with Valid Credentials**

**Method:** POST  
**URL:** `http://localhost:8080/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "ankit@gmail.com",
  "password": "123456"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Login successful!",
  "role": "USER"
}
```

---

### **Request 4: Login with Invalid Password**

**Method:** POST  
**URL:** `http://localhost:8080/auth/login`

**Request Body:**
```json
{
  "email": "ankit@gmail.com",
  "password": "wrongpassword"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "token": null,
  "message": "Invalid password!",
  "role": null
}
```

---

### **Request 5: Access Public Endpoint (No JWT Needed)**

**Method:** GET  
**URL:** `http://localhost:8080/auth/public/test`

**Expected Response (200 OK):**
```
This is a public endpoint - No authentication required!
```

---

### **Request 6: Access Protected Endpoint with Valid JWT**

**Method:** GET  
**URL:** `http://localhost:8080/auth/protected/test`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

(Replace with token from login response)

**Expected Response (200 OK):**
```
Protected endpoint accessed by: ankit@gmail.com
```

---

### **Request 7: Access Protected Endpoint WITHOUT JWT**

**Method:** GET  
**URL:** `http://localhost:8080/auth/protected/test`

**Headers:** (Leave empty or remove Authorization)

**Expected Response (403 Forbidden):**
```
Access Denied
```

---

### **Request 8: User Accessing Admin Endpoint (Should Fail)**

**Method:** GET  
**URL:** `http://localhost:8080/auth/admin/test`

**Headers:**
```
Authorization: Bearer <USER_JWT_TOKEN>
```

**Expected Response (403 Forbidden):**
```
Access Denied
```

---

### **Request 9: Admin Accessing Admin Endpoint (Should Succeed)**

**Method:** GET  
**URL:** `http://localhost:8080/auth/admin/test`

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Expected Response (200 OK):**
```
This is an admin-only endpoint!
```

---

### **Request 10: User Accessing User-Only Endpoint (Should Succeed)**

**Method:** GET  
**URL:** `http://localhost:8080/auth/user/test`

**Headers:**
```
Authorization: Bearer <USER_JWT_TOKEN>
```

**Expected Response (200 OK):**
```
This is a user-only endpoint!
```

---

## Testing Workflow

### Complete Test Flow:

```
1. Start Application (mvn spring-boot:run)
   ↓
2. Register User with email: user@test.com
   ↓
3. Register Admin with email: admin@test.com
   ↓
4. Login as User → Save token in Postman variable
   ↓
5. Use token to access /protected/test → Success
   ↓
6. Try to access /admin/test with user token → 403 Forbidden
   ↓
7. Login as Admin → Save admin token
   ↓
8. Use admin token to access /admin/test → Success
   ↓
9. Try duplicate email registration → Error message
   ↓
10. Try invalid password login → 401 Unauthorized
```

---

## Using Postman Environment Variables

### Save JWT Token as Variable in Postman

1. In the **Login** request → **Tests** tab, add:
```javascript
var jsonData = pm.response.json();
pm.environment.set("userToken", jsonData.token);
pm.environment.set("userRole", jsonData.role);
```

2. In protected endpoints, use header:
```
Authorization: Bearer {{userToken}}
```

This way, you don't need to manually copy-paste tokens!

---

## Troubleshooting

### Issue 1: Database Connection Failed
**Error:** `Connection refused`
**Solution:**
- Ensure PostgreSQL is running
- Check username/password in application.properties
- Verify database `authservice_db` exists

### Issue 2: Port Already in Use
**Error:** `Port 8080 already in use`
**Solution:**
- Change port in application.properties: `server.port=8081`
- Or kill the process: `lsof -ti:8080 | xargs kill -9`

### Issue 3: JWT Token Invalid
**Error:** `Cannot set user authentication`
**Solution:**
- Ensure JWT secret in application.properties is configured
- Token expiration time hasn't passed
- Token format is: `Bearer <token>`

### Issue 4: Email Already Exists
**Error:** `Email already registered!`
**Solution:**
- Use a different email for testing
- Or clear the users table: `DELETE FROM users;`

### Issue 5: CORS Issues (Frontend)
**Solution:**
- CORS is already enabled in controller: `@CrossOrigin(origins = "*")`
- If issues persist, add to SecurityConfig:
```java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("*"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Arrays.asList("*"));
    return config;
}))
```

---

## File Structure Summary

```
authservice/
├── pom.xml                           # Maven dependencies
├── src/
│   ├── main/
│   │   ├── java/com/cineverse/authservice/
│   │   │   ├── AuthServiceApplication.java    # Main entry point
│   │   │   ├── controller/
│   │   │   │   └── AuthController.java        # API endpoints
│   │   │   ├── service/
│   │   │   │   └── AuthService.java           # Business logic
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java        # Database queries
│   │   │   ├── entity/
│   │   │   │   ├── User.java                  # Database table
│   │   │   │   └── UserRole.java              # Enum for roles
│   │   │   ├── dto/
│   │   │   │   ├── RegisterRequest.java       # Registration data
│   │   │   │   ├── LoginRequest.java          # Login data
│   │   │   │   └── AuthResponse.java          # Response data
│   │   │   ├── security/
│   │   │   │   ├── JwtUtil.java               # JWT operations
│   │   │   │   └── JwtAuthenticationFilter.java # JWT filter
│   │   │   └── config/
│   │   │       └── SecurityConfig.java        # Spring Security config
│   │   └── resources/
│   │       └── application.properties         # Application config
│   └── test/                         # Test files
```

---

## Key Concepts Explained

### JWT (JSON Web Token)
- Three parts separated by dots: `header.payload.signature`
- Payload contains: email (subject), role (claim), expiration time
- Signature is created using secret key (only server knows it)
- Server can verify token hasn't been tampered with

### BCrypt Password Encoding
- One-way hashing algorithm
- Same password always generates different hash (due to salt)
- Can verify if provided password matches hash
- Extremely difficult to reverse (brute-force resistant)

### Role-Based Access Control (RBAC)
- Different endpoints require different roles
- USER role: Regular user endpoints
- ADMIN role: Administrative endpoints
- Implemented using `@PreAuthorize` annotation

### Stateless Authentication
- Server doesn't store session information
- All info is in JWT token (email, role, expiration)
- Easier to scale (no session storage needed)
- Better for microservices

---

## Next Steps

1. **Add Email Verification**: Verify email before allowing login
2. **Add Refresh Tokens**: Allow users to get new tokens without logging in again
3. **Add Logout Blacklist**: Invalidate tokens on logout
4. **Add Password Reset**: Allow users to reset forgotten passwords
5. **Add Rate Limiting**: Prevent brute-force attacks
6. **Add Audit Logging**: Track login attempts and API usage

---

## For College Viva/Interview

### Key Points to Mention:
1. **Authentication vs Authorization**:
   - Authentication: Verify user identity (Login)
   - Authorization: Check user permissions (Roles)

2. **Why JWT?**:
   - Stateless: No server-side session storage
   - Scalable: Good for microservices
   - Secure: Token is signed and can't be tampered with

3. **Why BCrypt?**:
   - One-way hashing: Can't reverse to get original password
   - Salt: Prevents rainbow table attacks
   - Cost factor: Can be increased for future-proofing

4. **Spring Security Flow**:
   - Request → Filter Chain → JwtAuthenticationFilter → SecurityContext → Controller

5. **Why DTOs?**:
   - Separation of concerns: Entity (DB model) ≠ DTO (Transfer object)
   - Security: Don't expose all entity fields
   - Flexibility: Can validate input

---

## Common Exam Questions

**Q1: What happens if JWT token is tampered?**
A: Token signature validation will fail, and token will be rejected.

**Q2: How is password stored securely?**
A: Using BCrypt one-way hashing. Only hash is stored, not actual password.

**Q3: Why use stateless authentication?**
A: Easier to scale horizontally, better for microservices, no session storage needed.

**Q4: How is role-based access enforced?**
A: Using @PreAuthorize annotation and Spring Security's authorization checks.

**Q5: What's the difference between /auth/register and /auth/login?**
A: Register creates new user account, Login verifies credentials and returns token.

---

Generated for CineVerse Project - Spring Boot Authentication Service
