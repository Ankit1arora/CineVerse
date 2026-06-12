# API Gateway - Setup and Testing Guide

## Overview

The **API Gateway** is the entry point for all client requests in CineVerse. It:
- Routes requests to the appropriate backend service
- Validates JWT tokens for protected endpoints
- Logs all incoming requests
- Handles public and protected routes

```
┌─────────┐
│ Client  │
└────┬────┘
     │ HTTP Request
     ▼
┌─────────────────────────────────────┐
│     API Gateway (Port 8080)         │
│ ┌─────────────────────────────────┐ │
│ │ JWT Validation Filter           │ │ Protected endpoints
│ │ Logging Filter                  │ │ require token
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Route Configuration             │ │
│ │ Public: /auth/register, /login  │ │
│ │ Protected: /movies, /reviews    │ │
│ └─────────────────────────────────┘ │
└─────┬────────────────────────────────┘
      │
      ├─── /auth/** ──────────→ Auth Service (8081)
      ├─── /movies/** ────────→ Movie Service (8082)
      └─── /reviews/** ───────→ Review Service (8083)
```

---

## Prerequisites

### 1. Auth Service Must Be Running
The API Gateway depends on the Auth Service for JWT validation and user authentication.

**Start Auth Service:**
```bash
cd backend/authservice
mvn spring-boot:run
# Should be running on http://localhost:8081
```

**Verify Auth Service is running:**
```bash
curl -X GET http://localhost:8081/auth/public/test
# Should return: "✓ Public endpoint works!"
```

### 2. Backend Services (Optional for testing)
For complete testing, you may also start:
- Movie Service on `http://localhost:8082`
- Review Service on `http://localhost:8083`

If not running, the gateway will still route but services won't respond.

---

## Setup Steps

### Step 1: Navigate to Gateway Directory
```bash
cd backend/gateway
```

### Step 2: Build the Project
```bash
mvn clean install
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXX s
[INFO] Finished at: ...
```

### Step 3: Run the Gateway
```bash
mvn spring-boot:run
```

Expected output:
```
╔════════════════════════════════════════╗
║  CineVerse API Gateway Started!        ║
║  Listening on: http://localhost:8080   ║
║  All routes are logged below.          ║
╚════════════════════════════════════════╝

PUBLIC ROUTES (No JWT Required):
  POST   /auth/register
  POST   /auth/login

PROTECTED ROUTES (JWT Required):
  GET    /auth/protected/test
  GET    /auth/admin/test
  GET    /auth/user/test
  GET    /movies
  GET    /reviews
```

### Step 4: Verify Gateway is Running
```bash
curl -X GET http://localhost:8080/auth/public/test
```

Expected response:
```
✓ Public endpoint works!
```

---

## File Structure

```
gateway/
├── pom.xml                              # Maven dependencies
├── src/
│   ├── main/
│   │   ├── java/com/cineverse/gateway/
│   │   │   ├── GatewayApplication.java         # Main Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   └── GatewayRouteConfig.java     # Route definitions
│   │   │   ├── filter/
│   │   │   │   ├── JwtFilter.java              # JWT validation filter
│   │   │   │   └── LoggingFilter.java          # Request logging filter
│   │   │   └── security/
│   │   │       └── JwtUtil.java                # JWT validation utility
│   │   └── resources/
│   │       └── application.properties          # Configuration file
│   └── test/                            # Unit tests (optional)
└── GATEWAY_SETUP_AND_TESTING_GUIDE.md   # This file
```

---

## Configuration File (application.properties)

Key properties:
```properties
# Gateway port
server.port=8080

# Service URLs (update if services run on different ports)
auth.service.url=http://localhost:8081
movie.service.url=http://localhost:8082
review.service.url=http://localhost:8083

# JWT secret (must match authservice secret)
app.jwt.secret=mySecretKeyForJWTTokenGenerationChangeMeInProduction12345678

# JWT expiration (24 hours in milliseconds)
app.jwt.expiration=86400000
```

---

## How It Works

### 1. Public Routes (No JWT Required)

**Route: /auth/register**
- Method: POST
- JWT Required: ❌ No
- Flow:
  1. Client sends registration request to gateway
  2. Gateway routes to Auth Service
  3. Auth Service handles registration
  4. Returns new JWT token

**Route: /auth/login**
- Method: POST
- JWT Required: ❌ No
- Flow:
  1. Client sends login request to gateway
  2. Gateway routes to Auth Service
  3. Auth Service validates credentials
  4. Returns JWT token

### 2. Protected Routes (JWT Required)

All other routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

**Flow:**
1. Client sends request with Authorization header
2. **LoggingFilter** logs the request
3. **JwtFilter** extracts and validates JWT:
   - Checks "Bearer" prefix exists
   - Validates token signature
   - Checks token expiration
   - Extracts user email and role
4. If valid: forwards to backend service
5. If invalid: returns 401 Unauthorized

---

## Testing Guide

### Test 1: Public Endpoint (No JWT)
Verify that public endpoints work without token.

**Request:**
```bash
curl -X GET http://localhost:8080/auth/public/test
```

**Expected Response:**
```
✓ Public endpoint works!
```

**Expected Gateway Log:**
```
╔════════════════════════════════════════╗
║ INCOMING REQUEST                       ║
╠════════════════════════════════════════╣
║ Method: GET                            ║
║ Path:   /auth/public/test              ║
╚════════════════════════════════════════╝
```

---

### Test 2: Register New User
Create a new user account.

**Request:**
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

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully",
  "role": "USER"
}
```

**Expected Gateway Log:**
```
✓ JWT Valid - User: john@example.com | Role: USER
```

---

### Test 3: Login User
Login with registered credentials.

**Request:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "role": "USER"
}
```

---

### Test 4: Protected Endpoint WITH Valid JWT
Access protected endpoint with valid token.

**Steps:**
1. First, login to get token (see Test 3)
2. Copy the `token` value from response
3. Use token in Authorization header

**Request:**
```bash
curl -X GET http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response:**
```
✓ Protected endpoint works! User: john@example.com
```

**Expected Gateway Log:**
```
╔════════════════════════════════════════╗
║ INCOMING REQUEST                       ║
╠════════════════════════════════════════╣
║ Method: GET                            ║
║ Path:   /auth/protected/test           ║
╚════════════════════════════════════════╝
✓ JWT Valid - User: john@example.com | Role: USER
```

---

### Test 5: Protected Endpoint WITHOUT Token
Try to access protected endpoint without JWT.

**Request:**
```bash
curl -X GET http://localhost:8080/auth/protected/test
```

**Expected Response:**
```
HTTP/1.1 401 Unauthorized
```

**Expected Gateway Log:**
```
✗ JWT Validation Error: Missing or invalid Authorization header
```

---

### Test 6: Protected Endpoint WITH Invalid Token
Try to access protected endpoint with fake token.

**Request:**
```bash
curl -X GET http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer invalid_token_123"
```

**Expected Response:**
```
HTTP/1.1 401 Unauthorized
```

**Expected Gateway Log:**
```
✗ JWT Validation Error: Invalid token signature
```

---

### Test 7: Admin-Only Endpoint
Access admin-only endpoint with USER token.

**Steps:**
1. Login as regular user (see Test 3)
2. Try to access admin endpoint

**Request:**
```bash
curl -X GET http://localhost:8080/auth/admin/test \
  -H "Authorization: Bearer <user_token>"
```

**Expected Response:**
```
HTTP/1.1 403 Forbidden
Access denied: Admin role required
```

---

### Test 8: Movies Route (Protected)
Access movie service through gateway.

**Request:**
```bash
curl -X GET http://localhost:8080/movies \
  -H "Authorization: Bearer <valid_token>"
```

**Expected Response:**
- If Movie Service is running: Movie list from service
- If Movie Service is not running: Connection error

**Expected Gateway Log:**
```
✓ JWT Valid - User: john@example.com | Role: USER
Request routed to: http://localhost:8082/movies
```

---

### Test 9: Reviews Route (Protected)
Access review service through gateway.

**Request:**
```bash
curl -X GET http://localhost:8080/reviews \
  -H "Authorization: Bearer <valid_token>"
```

**Expected Response:**
- If Review Service is running: Review list from service
- If Review Service is not running: Connection error

---

## Postman Testing

### Setup Postman Collection

**Step 1: Create Environment Variable**
1. In Postman, click "Environments"
2. Click "+" to create new environment
3. Name: "CineVerse"
4. Add variables:
   - `base_url`: `http://localhost:8080`
   - `jwt_token`: `` (will be filled after login)
5. Save

**Step 2: Create Requests**

#### Request 1: Register User
```
Method: POST
URL: {{base_url}}/auth/register
Headers:
  Content-Type: application/json
Body (JSON):
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "USER"
}
```

#### Request 2: Login
```
Method: POST
URL: {{base_url}}/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**After this request, copy the `token` and set environment variable `jwt_token` to this value.**

#### Request 3: Public Test Endpoint
```
Method: GET
URL: {{base_url}}/auth/public/test
```

#### Request 4: Protected Test Endpoint
```
Method: GET
URL: {{base_url}}/auth/protected/test
Headers:
  Authorization: Bearer {{jwt_token}}
```

#### Request 5: Admin Test Endpoint
```
Method: GET
URL: {{base_url}}/auth/admin/test
Headers:
  Authorization: Bearer {{jwt_token}}
```

#### Request 6: Get Movies
```
Method: GET
URL: {{base_url}}/movies
Headers:
  Authorization: Bearer {{jwt_token}}
```

#### Request 7: Get Reviews
```
Method: GET
URL: {{base_url}}/reviews
Headers:
  Authorization: Bearer {{jwt_token}}
```

---

## Troubleshooting

### Issue 1: Gateway Won't Start
**Error:**
```
Port 8080 is already in use
```

**Solution:**
1. Kill process on port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <pid> /F
   
   # Linux/Mac
   lsof -i :8080
   kill -9 <pid>
   ```
2. Or change port in `application.properties`:
   ```properties
   server.port=8090
   ```

### Issue 2: JWT Validation Fails
**Error:**
```
JWT Validation Error: Invalid token signature
```

**Cause:** JWT secret in gateway doesn't match auth service secret

**Solution:**
1. Ensure both services use same secret in `application.properties`:
   ```properties
   app.jwt.secret=mySecretKeyForJWTTokenGenerationChangeMeInProduction12345678
   ```
2. Restart both services

### Issue 3: Can't Connect to Auth Service
**Error:**
```
java.net.ConnectException: Connection refused
```

**Solution:**
1. Verify Auth Service is running on port 8081
2. Check `auth.service.url` in `application.properties`:
   ```properties
   auth.service.url=http://localhost:8081
   ```
3. Start Auth Service:
   ```bash
   cd backend/authservice
   mvn spring-boot:run
   ```

### Issue 4: 401 Unauthorized on Protected Routes
**Cause:** Missing or invalid JWT token

**Solution:**
1. Ensure Authorization header format is correct:
   ```
   Authorization: Bearer <token>
   ```
2. Verify token is not expired (24 hour lifetime)
3. Get new token by logging in again

---

## Quick Commands

### Start Gateway
```bash
cd backend/gateway
mvn spring-boot:run
```

### Start All Services (in separate terminals)
```bash
# Terminal 1: Auth Service
cd backend/authservice
mvn spring-boot:run

# Terminal 2: Gateway
cd backend/gateway
mvn spring-boot:run

# Terminal 3: Movie Service (if available)
cd backend/movie-service
mvn spring-boot:run

# Terminal 4: Review Service (if available)
cd backend/review-service
mvn spring-boot:run
```

### Test All Routes (bash script)
```bash
#!/bin/bash

echo "1. Testing public endpoint..."
curl http://localhost:8080/auth/public/test

echo "\n2. Registering user..."
TOKEN=$(curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"USER"}' | jq -r '.token')

echo "\n3. Testing protected endpoint with JWT..."
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/auth/protected/test

echo "\n✓ All tests completed!"
```

---

## Next Steps

1. ✅ Gateway is now running and routing requests
2. 🟡 Create Movie Service (backend/movie-service)
3. 🟡 Create Review Service (backend/review-service)
4. 🟡 Update frontend to use gateway instead of direct service calls
5. 🟡 Add more filters (rate limiting, request validation)
6. 🟡 Add metrics and monitoring

---

## Summary

The API Gateway:
- ✅ Routes all requests to appropriate services
- ✅ Validates JWT tokens for protected routes
- ✅ Logs all incoming requests
- ✅ Handles public routes without authentication
- ✅ Returns 401 for invalid/missing tokens
- ✅ Extracts user info for logging and tracing

---

**For more information:**
- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [Spring Security Guide](https://spring.io/guides/topical/spring-security-architecture/)
