# API Gateway - Quick Reference

The **API Gateway** is the central routing layer for CineVerse microservices. It routes client requests to the appropriate backend service and validates JWT tokens.

## 🚀 Quick Start (5 mins)

### Prerequisites
- Java 21+
- Maven 3.8+
- Auth Service running on `http://localhost:8081`

### Start Gateway
```bash
cd backend/gateway
mvn spring-boot:run
```

Gateway runs on: **http://localhost:8080**

### Test It
```bash
# Public endpoint (no token needed)
curl http://localhost:8080/auth/public/test

# Login to get token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Use token for protected endpoint
curl http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer <token>"
```

---

## 📋 Route Summary

| Path | Method | JWT Required | Routes To | Purpose |
|------|--------|--------------|-----------|---------|
| `/auth/register` | POST | ❌ No | Auth Service | Register new user |
| `/auth/login` | POST | ❌ No | Auth Service | Login and get JWT |
| `/auth/**` | GET | ✅ Yes | Auth Service | Protected auth endpoints |
| `/movies/**` | * | ✅ Yes | Movie Service | Movie operations |
| `/reviews/**` | * | ✅ Yes | Review Service | Review operations |

---

## 📁 File Structure

```
gateway/
├── pom.xml                          # Maven dependencies
├── README.md                         # This file
├── GATEWAY_SETUP_AND_TESTING_GUIDE.md
└── src/main/
    ├── java/com/cineverse/gateway/
    │   ├── GatewayApplication.java
    │   ├── config/
    │   │   └── GatewayRouteConfig.java
    │   ├── filter/
    │   │   ├── JwtFilter.java
    │   │   └── LoggingFilter.java
    │   └── security/
    │       └── JwtUtil.java
    └── resources/
        └── application.properties
```

---

## 🔑 Key Concepts

### 1. JWT Validation Flow
```
Client Request
    ↓
LoggingFilter (logs request)
    ↓
JwtFilter (validates token)
    ├─ Extract "Bearer <token>" from Authorization header
    ├─ Validate token signature (same secret as auth service)
    ├─ Check if token is expired
    └─ Extract email and role
    ↓
Route to Backend Service
    ↓
Service Response
```

### 2. Public vs Protected Routes

**Public Routes** (no JWT required):
- `POST /auth/register` - for new users
- `POST /auth/login` - for getting JWT token

**Protected Routes** (JWT required):
- Everything else
- Must include `Authorization: Bearer <token>` header
- Returns 401 if token invalid/missing

### 3. Configuration

File: `src/main/resources/application.properties`

Key settings:
```properties
server.port=8080                              # Gateway port
auth.service.url=http://localhost:8081        # Auth service location
movie.service.url=http://localhost:8082       # Movie service location
review.service.url=http://localhost:8083      # Review service location
app.jwt.secret=...                            # Same as auth service
app.jwt.expiration=86400000                   # 24 hours
```

---

## 📚 Component Overview

### GatewayApplication.java
- Spring Boot entry point
- Runs on port 8080
- Loads all beans and filters

### GatewayRouteConfig.java
- Defines all routes
- Maps `/auth/**` → Auth Service
- Maps `/movies/**` → Movie Service
- Maps `/reviews/**` → Review Service
- Applies JWT filter to protected routes

### JwtFilter.java
- Custom gateway filter for JWT validation
- Checks Authorization header
- Validates token signature and expiration
- Returns 401 if invalid

### LoggingFilter.java
- Global filter that runs for all requests
- Logs HTTP method, path, query params
- Useful for debugging and monitoring

### JwtUtil.java
- Utility class for JWT operations
- Validates tokens
- Extracts email and role from tokens
- Uses same secret as auth service

---

## 🧪 Testing Examples

### Example 1: Register User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully",
  "role": "USER"
}
```

### Example 2: Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "role": "USER"
}
```

### Example 3: Use Token for Protected Route
```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use in Authorization header
curl -X GET http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```
✓ Protected endpoint works! User: john@example.com
```

---

## 🐛 Troubleshooting

### Port 8080 Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :8080
kill -9 <pid>
```

### Can't Connect to Auth Service
- Ensure Auth Service is running on port 8081
- Check `auth.service.url` in `application.properties`
- Restart both services if needed

### JWT Token Invalid
- Ensure same `app.jwt.secret` in both gateway and auth service
- Check token is not expired (24 hour lifetime)
- Verify Authorization header format: `Bearer <token>`

### 401 Unauthorized on Protected Routes
- Missing Authorization header
- Invalid/expired token
- Token format incorrect

---

## 📖 Learn More

For detailed setup, testing, and troubleshooting:
→ See **GATEWAY_SETUP_AND_TESTING_GUIDE.md**

---

## ✅ What's Included

- ✅ Route configuration for all backend services
- ✅ JWT token validation
- ✅ Request logging
- ✅ Public and protected route handling
- ✅ Error handling with 401 responses
- ✅ Comprehensive testing guide
- ✅ Postman examples

---

## 🔄 Request Flow Example

```
User Login:
1. Client: POST /auth/login → Gateway
2. Gateway (LoggingFilter): Logs "POST /auth/login"
3. Gateway (RouteConfig): Routes to Auth Service
4. Auth Service: Validates credentials, returns JWT
5. Gateway: Passes JWT back to client

User Accessing Protected Route:
1. Client: GET /movies (with Authorization: Bearer <token>)
2. Gateway (LoggingFilter): Logs request
3. Gateway (JwtFilter): Validates token signature and expiration
4. JwtFilter: Extracts email and role
5. Gateway (RouteConfig): Routes to Movie Service
6. Movie Service: Returns movies for authenticated user
7. Gateway: Passes response back to client

Invalid Token:
1. Client: GET /movies (with invalid token)
2. Gateway (LoggingFilter): Logs request
3. Gateway (JwtFilter): Detects invalid token
4. JwtFilter: Returns 401 Unauthorized
5. Request does NOT reach Movie Service
```

---

## 🎯 Next Steps

1. ✅ Gateway is running
2. Test all public and protected routes (see testing guide)
3. Create Movie Service (backend/movie-service)
4. Create Review Service (backend/review-service)
5. Update frontend to use gateway instead of direct calls

---

**Questions?** Check GATEWAY_SETUP_AND_TESTING_GUIDE.md for detailed instructions.
