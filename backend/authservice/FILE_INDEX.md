# CineVerse Authentication Service - Complete File Index & Navigation Guide

## 📚 Documentation Files (Start Here!)

Read in this order for best learning:

### 1. **README.md** (5-10 minutes) ⭐ START HERE
- **Purpose**: Quick overview of the project
- **Contains**: Project structure, quick start, key concepts
- **Best for**: Getting started quickly, understanding basics
- **Location**: `authservice/README.md`

### 2. **PROJECT_SUMMARY.md** (10-15 minutes)
- **Purpose**: Complete project overview
- **Contains**: All files created, technologies used, testing scenarios
- **Best for**: Understanding what was built and why
- **Location**: `authservice/PROJECT_SUMMARY.md`

### 3. **SETUP_AND_TESTING_GUIDE.md** (20-30 minutes) ⭐ MOST DETAILED
- **Purpose**: Complete setup and Postman testing guide
- **Contains**: Database setup, 10 Postman test requests with examples
- **Best for**: Hands-on setup and testing
- **Location**: `authservice/SETUP_AND_TESTING_GUIDE.md`

### 4. **ARCHITECTURE_DIAGRAMS.md** (15-20 minutes)
- **Purpose**: Visual architecture and data flow diagrams
- **Contains**: Layered architecture, security flow, request flows
- **Best for**: Understanding system design visually
- **Location**: `authservice/ARCHITECTURE_DIAGRAMS.md`

---

## 🔧 Configuration Files

### 1. **pom.xml**
- **Purpose**: Maven project configuration and dependencies
- **Location**: `authservice/pom.xml`
- **Key Section**: `<dependencies>` contains all libraries
- **To understand**: 
  - Spring Boot Starter Web, Security, Data JPA
  - JWT library (JJWT)
  - PostgreSQL driver
  - Lombok
  - Validation

### 2. **application.properties**
- **Purpose**: Application runtime configuration
- **Location**: `authservice/src/main/resources/application.properties`
- **Key Settings**:
  - Database URL, username, password
  - JWT secret and expiration
  - JPA/Hibernate settings
  - Logging configuration
- **⚠️ IMPORTANT**: Update database credentials before running

---

## 💻 Source Code Files (14 Java files)

### Core Application Entry Point (1 file)

**📄 AuthServiceApplication.java**
- **Package**: `com.cineverse.authservice`
- **Purpose**: Main Spring Boot application entry point
- **Contains**: 
  - `@SpringBootApplication` annotation
  - `@EnableMethodSecurity` for @PreAuthorize
  - `main()` method
- **Lines of code**: ~15
- **Learning**: How Spring Boot initializes applications
- **To read**: `src/main/java/com/cineverse/authservice/AuthServiceApplication.java`

---

### Entity Layer (2 files)
*Database models - defines what gets stored*

**📄 User.java**
- **Package**: `com.cineverse.authservice.entity`
- **Purpose**: JPA Entity representing users table in database
- **Fields**: id, name, email, password, role
- **Key Annotations**:
  - `@Entity` - Maps to database table
  - `@Table(name = "users")` - Specifies table name
  - `@Column` - Specifies column properties
  - `@GeneratedValue` - Auto-increment ID
  - `@Enumerated` - Stores enum as string
- **Lines of code**: ~25
- **Learning**: JPA entity mapping, Lombok annotations
- **To read**: `src/main/java/com/cineverse/authservice/entity/User.java`

**📄 UserRole.java**
- **Package**: `com.cineverse.authservice.entity`
- **Purpose**: Enum defining all possible user roles
- **Values**: USER, ADMIN
- **Why enum**: Type safety, prevents invalid values
- **Lines of code**: ~5
- **Learning**: Java enums, best practices for fixed values
- **To read**: `src/main/java/com/cineverse/authservice/entity/UserRole.java`

---

### DTO Layer (3 files)
*Data Transfer Objects - for API requests/responses*

**📄 RegisterRequest.java**
- **Package**: `com.cineverse.authservice.dto`
- **Purpose**: DTO for user registration API request
- **Fields**: name, email, password, role
- **Validation Annotations**:
  - `@NotBlank` - Field required, not empty
  - `@Email` - Valid email format
  - `@Size(min=6)` - Minimum length
- **Lines of code**: ~20
- **Learning**: Input validation, Spring validation annotations
- **To read**: `src/main/java/com/cineverse/authservice/dto/RegisterRequest.java`

**📄 LoginRequest.java**
- **Package**: `com.cineverse.authservice.dto`
- **Purpose**: DTO for login API request
- **Fields**: email, password
- **Validation**: Email format, not blank
- **Lines of code**: ~15
- **Learning**: Simple DTO with validation
- **To read**: `src/main/java/com/cineverse/authservice/dto/LoginRequest.java`

**📄 AuthResponse.java**
- **Package**: `com.cineverse.authservice.dto`
- **Purpose**: DTO for authentication API response
- **Fields**: token (JWT), message, role
- **Usage**: Returned from /auth/register and /auth/login
- **Lines of code**: ~12
- **Learning**: Response object structure
- **To read**: `src/main/java/com/cineverse/authservice/dto/AuthResponse.java`

---

### Repository Layer (1 file)
*Database access - queries and persistence*

**📄 UserRepository.java**
- **Package**: `com.cineverse.authservice.repository`
- **Purpose**: JPA Repository for User entity database operations
- **Extends**: JpaRepository<User, Long>
- **Custom Methods**:
  - `Optional<User> findByEmail(String email)` - Find user by email
  - `boolean existsByEmail(String email)` - Check if email exists
- **Built-in Methods** (from JpaRepository):
  - `save()`, `findById()`, `findAll()`, `delete()`, etc.
- **How it works**: Spring Data JPA automatically implements these methods
- **Lines of code**: ~25
- **Learning**: Spring Data JPA, custom query methods, Optional pattern
- **To read**: `src/main/java/com/cineverse/authservice/repository/UserRepository.java`

---

### Security Layer (2 files)
*JWT and authentication handling*

**📄 JwtUtil.java** ⭐ MOST IMPORTANT FOR SECURITY
- **Package**: `com.cineverse.authservice.security`
- **Purpose**: JWT token generation, validation, and claim extraction
- **Key Methods**:
  - `generateToken(email, role)` - Creates JWT with email and role
  - `validateToken(token)` - Verifies signature and expiration
  - `getEmailFromToken(token)` - Extracts email from token
  - `getRoleFromToken(token)` - Extracts role from token
  - `isTokenExpired(token)` - Checks if token has expired
- **How it works**:
  1. Uses secret key from application.properties
  2. Creates HMAC-SHA256 signature
  3. Includes email (subject), role (claim), expiration time
  4. Returns base64-encoded token string
- **Lines of code**: ~80
- **Learning**: JWT creation and validation, cryptographic signatures
- **Key Concepts**:
  - Header: Algorithm (HS256)
  - Payload: Claims (email, role, expiration)
  - Signature: Created with secret key
- **To read**: `src/main/java/com/cineverse/authservice/security/JwtUtil.java`

**📄 JwtAuthenticationFilter.java** ⭐ SECURITY FILTER
- **Package**: `com.cineverse.authservice.security`
- **Purpose**: Intercepts HTTP requests to validate JWT tokens
- **Extends**: OncePerRequestFilter (runs once per request)
- **Process**:
  1. Extract JWT from Authorization header
  2. Validate token using JwtUtil
  3. Extract email and role from token
  4. Create UsernamePasswordAuthenticationToken
  5. Set in SecurityContextHolder
- **Result**: User is now authenticated for that request
- **Lines of code**: ~65
- **Learning**: Spring Security filters, request interception, authentication
- **To read**: `src/main/java/com/cineverse/authservice/security/JwtAuthenticationFilter.java`

---

### Configuration Layer (1 file)
*Spring Security configuration*

**📄 SecurityConfig.java** ⭐ CONFIGURATION
- **Package**: `com.cineverse.authservice.config`
- **Purpose**: Spring Security configuration for entire application
- **Key Beans**:
  - `PasswordEncoder` - BCryptPasswordEncoder for password hashing
  - `SecurityFilterChain` - Main security configuration
- **Configures**:
  - Public endpoints (no auth needed): /auth/register, /auth/login
  - Protected endpoints (JWT required): /auth/protected/test
  - Role-based endpoints: /auth/admin/test (ADMIN only), /auth/user/test (USER only)
  - JWT filter registration
  - Stateless session (no server-side session storage)
  - CSRF disabled (safe for REST APIs)
- **Lines of code**: ~70
- **Learning**: Spring Security configuration, password encoding, authorization rules
- **Key Concepts**:
  - BCrypt has configurable strength (default 10 = 2^10 iterations)
  - Stateless = no HttpSession, perfect for microservices
  - Filter chain order matters
- **To read**: `src/main/java/com/cineverse/authservice/config/SecurityConfig.java`

---

### Service Layer (1 file)
*Business logic - core application logic*

**📄 AuthService.java** ⭐ MAIN BUSINESS LOGIC
- **Package**: `com.cineverse.authservice.service`
- **Purpose**: Handles authentication business logic
- **Key Methods**:
  - `register(RegisterRequest)` - Register new user
    1. Validate email uniqueness
    2. Encode password with BCrypt
    3. Save user to database
    4. Generate JWT token
    5. Return response
  - `login(LoginRequest)` - Authenticate user
    1. Find user by email
    2. Verify password matches hash
    3. Generate JWT token
    4. Return response
- **Dependencies**:
  - UserRepository - Database access
  - PasswordEncoder - BCrypt encoding
  - JwtUtil - Token generation
- **Lines of code**: ~70
- **Learning**: Service layer pattern, business logic organization, password verification
- **Error Handling**:
  - Email already exists
  - User not found
  - Invalid password
- **To read**: `src/main/java/com/cineverse/authservice/service/AuthService.java`

---

### Controller Layer (1 file)
*REST API endpoints - receives HTTP requests*

**📄 AuthController.java** ⭐ REST ENDPOINTS
- **Package**: `com.cineverse.authservice.controller`
- **Purpose**: REST API endpoints for authentication
- **Base Path**: `/auth`
- **Endpoints**:
  1. `POST /auth/register` - Register new user
  2. `POST /auth/login` - Login and receive JWT
  3. `GET /auth/public/test` - Public test endpoint
  4. `GET /auth/protected/test` - Protected test endpoint
  5. `GET /auth/admin/test` - Admin-only endpoint
  6. `GET /auth/user/test` - User-only endpoint
- **Key Annotations**:
  - `@PostMapping`, `@GetMapping` - HTTP methods
  - `@RequestBody` - Parse request body to DTO
  - `@Valid` - Validate request DTO
  - `@PreAuthorize("hasRole('ADMIN')")` - Role-based access
- **Error Handling**:
  - 201 Created (successful registration)
  - 200 OK (successful login)
  - 400 Bad Request (validation error)
  - 401 Unauthorized (login failed)
  - 403 Forbidden (insufficient permissions)
- **Lines of code**: ~120
- **Learning**: Spring REST controllers, HTTP methods, error responses
- **To read**: `src/main/java/com/cineverse/authservice/controller/AuthController.java`

---

## 📊 File Relationship Diagram

```
AuthController (API)
    ↓ calls
AuthService (Business Logic)
    ↓ calls
├─ UserRepository (Database)
├─ PasswordEncoder (BCrypt)
└─ JwtUtil (JWT)

SecurityConfig (Setup)
    ├─ Creates PasswordEncoder bean
    ├─ Registers JwtAuthenticationFilter
    └─ Configures endpoints

JwtAuthenticationFilter (Filter)
    ├─ Uses JwtUtil to validate
    └─ Sets SecurityContext

Data Models:
├─ User (Entity) ↔ PostgreSQL database
├─ UserRole (Enum) ↔ User.role field
├─ RegisterRequest (DTO) → Controller input
├─ LoginRequest (DTO) → Controller input
└─ AuthResponse (DTO) → Controller output
```

---

## 🔍 Quick File Lookup

### To understand Registration:
1. Read: `RegisterRequest.java` (what data comes in)
2. Read: `AuthService.register()` (how it's processed)
3. Read: `User.java` (what's stored)
4. Read: `JwtUtil.generateToken()` (how token is created)
5. Read: `AuthResponse.java` (what's returned)

### To understand JWT Authentication:
1. Read: `JwtUtil.java` (token creation and validation)
2. Read: `JwtAuthenticationFilter.java` (request interception)
3. Read: `SecurityConfig.java` (filter registration)
4. Read: `AuthController.java` (endpoints that use it)

### To understand Password Security:
1. Read: `SecurityConfig.passwordEncoder()` (BCrypt setup)
2. Read: `AuthService.register()` (password encoding)
3. Read: `AuthService.login()` (password verification)
4. Read: SETUP_AND_TESTING_GUIDE.md (BCrypt explanation)

### To understand Database:
1. Read: `User.java` (entity mapping)
2. Read: `UserRepository.java` (queries)
3. Read: `application.properties` (database config)
4. Read: SETUP_AND_TESTING_GUIDE.md (database setup)

---

## 📖 Recommended Reading Order

### First Time Learning (3-4 hours):

**Hour 1: Overview**
1. Read: README.md (5 min)
2. Read: PROJECT_SUMMARY.md (10 min)
3. Read: ARCHITECTURE_DIAGRAMS.md sections 1-2 (10 min)

**Hour 2: Theory**
1. Read: SETUP_AND_TESTING_GUIDE.md (20 min)
2. Read: SecurityConfig.java (10 min)
3. Read: JwtUtil.java (15 min)

**Hour 3: Implementation**
1. Read: AuthService.java (10 min)
2. Read: AuthController.java (10 min)
3. Read: User.java + DTOs (10 min)

**Hour 4: Practical**
1. Setup: Follow SETUP_AND_TESTING_GUIDE.md
2. Test: Run Postman requests
3. Debug: Use log output to understand flow

### For Quick Reference:
- JWT concepts: See ARCHITECTURE_DIAGRAMS.md
- Setup issues: See SETUP_AND_TESTING_GUIDE.md troubleshooting
- Code structure: See PROJECT_SUMMARY.md
- Quick start: See README.md

---

## 🎯 For College Viva Preparation

### Topics to Study:
1. **Authentication vs Authorization** - See README.md key concepts
2. **JWT Structure** - See ARCHITECTURE_DIAGRAMS.md token structure
3. **BCrypt Algorithm** - See ARCHITECTURE_DIAGRAMS.md password encoding
4. **Spring Security** - See SecurityConfig.java
5. **Stateless vs Stateful** - See SETUP_AND_TESTING_GUIDE.md concepts
6. **Role-Based Access Control** - See AuthController.java
7. **Microservices** - See PROJECT_SUMMARY.md context

### Files to Show/Explain:
1. AuthController.java - Show API endpoints
2. AuthService.java - Explain business logic
3. JwtUtil.java - Explain token generation
4. SecurityConfig.java - Explain security setup
5. ARCHITECTURE_DIAGRAMS.md - Show visual flows

### Questions You Might Get Asked:
- "Walk me through the login process" → Read login flow in ARCHITECTURE_DIAGRAMS.md
- "How is password secured?" → Read BCrypt section in ARCHITECTURE_DIAGRAMS.md
- "What's JWT and why use it?" → Read JWT explanation in README.md
- "Show the code for registration" → Point to AuthService.register() method
- "How do you check roles?" → Show @PreAuthorize in AuthController.java

---

## 💡 Tips for Understanding Code

### 1. Start with DTOs (Simplest)
- RegisterRequest, LoginRequest, AuthResponse
- See what data flows through the system

### 2. Then understand Entity (Data Model)
- User.java - What's stored in database
- UserRole.java - Possible role values

### 3. Then trace Service Logic (Business)
- AuthService - How registration and login work
- See how password encoding and JWT generation happen

### 4. Then understand Security (Complex)
- JwtUtil - How JWT tokens are created and validated
- JwtAuthenticationFilter - How requests are intercepted
- SecurityConfig - How security is configured

### 5. Finally understand Controller (API)
- AuthController - How requests come in
- How business logic is called
- How responses are returned

---

## ✅ Files Checklist

### Configuration (2 files)
- ✅ pom.xml
- ✅ application.properties

### Main Application (1 file)
- ✅ AuthServiceApplication.java

### Entity Layer (2 files)
- ✅ User.java
- ✅ UserRole.java

### DTO Layer (3 files)
- ✅ RegisterRequest.java
- ✅ LoginRequest.java
- ✅ AuthResponse.java

### Repository Layer (1 file)
- ✅ UserRepository.java

### Security Layer (2 files)
- ✅ JwtUtil.java
- ✅ JwtAuthenticationFilter.java

### Configuration Layer (1 file)
- ✅ SecurityConfig.java

### Service Layer (1 file)
- ✅ AuthService.java

### Controller Layer (1 file)
- ✅ AuthController.java

### Documentation (4 files)
- ✅ README.md
- ✅ PROJECT_SUMMARY.md
- ✅ SETUP_AND_TESTING_GUIDE.md
- ✅ ARCHITECTURE_DIAGRAMS.md
- ✅ FILE_INDEX.md (this file)

**Total: 19 files** (14 source + 5 documentation)

---

## 🚀 Next Steps After Understanding

1. **Run the application** (follow SETUP_AND_TESTING_GUIDE.md)
2. **Test endpoints** (follow Postman testing section)
3. **Make small changes** (try changing password requirements, JWT expiration, etc.)
4. **Add features** (email verification, refresh tokens, password reset)
5. **Deploy** (move to production with proper configuration)

---

## 📞 Finding What You Need

| I want to... | Read this file | Section |
|---|---|---|
| Quick overview | README.md | Start here |
| Setup project | SETUP_AND_TESTING_GUIDE.md | Database Setup |
| Understand JWT | ARCHITECTURE_DIAGRAMS.md | Token Structure |
| See architecture | ARCHITECTURE_DIAGRAMS.md | Architecture Diagram |
| Understand BCrypt | ARCHITECTURE_DIAGRAMS.md | Password Encoding |
| Test with Postman | SETUP_AND_TESTING_GUIDE.md | Postman Testing |
| Understand code | PROJECT_SUMMARY.md | Files Created |
| See flow diagrams | ARCHITECTURE_DIAGRAMS.md | Request/Response Flows |
| File locations | FILE_INDEX.md | Source Code Files |
| Key concepts | README.md | Key Concepts Explained |

---

## 📝 File Statistics

- **Total Java Files**: 14
- **Total Documentation**: 5 files
- **Total Lines of Code**: ~1,500+ (including comments)
- **Total Documentation Lines**: ~2,000+
- **Largest File**: SETUP_AND_TESTING_GUIDE.md (600+ lines)
- **Most Important File**: JwtUtil.java (80+ lines, core security)

---

**Ready to explore the CineVerse Authentication Service!**

Start with README.md → Then follow the recommended reading order above.

Good luck with your project! 🎓
