# API Gateway - File Index

Quick reference guide to all files in the gateway module. Use this to locate specific code or documentation.

---

## 📂 Directory Structure

```
gateway/
├── pom.xml
├── README.md
├── GATEWAY_SETUP_AND_TESTING_GUIDE.md
├── PRE_LAUNCH_CHECKLIST.md
├── FILE_INDEX.md
├── PROJECT_SUMMARY.md
├── MASTER_SUMMARY.md
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/cineverse/gateway/
    │   │       ├── GatewayApplication.java
    │   │       ├── config/
    │   │       │   └── GatewayRouteConfig.java
    │   │       ├── filter/
    │   │       │   ├── JwtFilter.java
    │   │       │   └── LoggingFilter.java
    │   │       └── security/
    │   │           └── JwtUtil.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/ (to be created for unit tests)
```

---

## 📋 Documentation Files

### README.md
**Purpose:** Quick reference guide for gateway  
**Audience:** Developers who need a 5-minute overview  
**Contains:**
- Quick start instructions
- Route summary table
- File structure overview
- Key concepts explanation
- Testing examples
- Troubleshooting tips

**When to use:** First stop for understanding the gateway

---

### GATEWAY_SETUP_AND_TESTING_GUIDE.md
**Purpose:** Comprehensive setup and testing documentation  
**Audience:** Developers setting up gateway for the first time  
**Contains:**
- Detailed architecture diagram
- Setup prerequisites (600+ lines)
- Step-by-step setup instructions
- Configuration file explanation
- How it works (request flow diagrams)
- 9+ testing examples with expected responses
- Postman collection setup
- Comprehensive troubleshooting section
- Quick commands reference
- Testing bash script

**When to use:** When doing initial setup or testing gateway

**Size:** ~800 lines

---

### PRE_LAUNCH_CHECKLIST.md
**Purpose:** Verification checklist before running gateway  
**Audience:** Developers verifying environment is ready  
**Contains:**
- 10 phases of verification
- Environment setup checks
- Project structure verification
- Configuration checks
- Build verification
- Startup test
- JWT token flow tests
- Console log verification
- Troubleshooting for each phase
- Final success checklist

**When to use:** Before starting gateway for the first time

**Size:** ~400 lines

---

### FILE_INDEX.md
**Purpose:** Navigation guide for all files (this file)  
**Contains:**
- Directory structure
- File descriptions
- Quick reference table
- Code file descriptions with key methods

---

### PROJECT_SUMMARY.md
**Purpose:** Overview of entire gateway project  
**Audience:** Project managers, documentation readers  
**Contains:**
- Project overview
- Technology stack
- File listing
- Component descriptions
- Architecture overview

*(To be created)*

---

### MASTER_SUMMARY.md
**Purpose:** Complete reference of everything in the gateway  
**Audience:** Anyone needing comprehensive reference  
**Contains:**
- Complete documentation
- All file contents summarized
- Code snippets for key sections
- Complete setup guide
- Complete testing guide

*(To be created)*

---

## 💻 Java Source Files

### GatewayApplication.java
**Package:** `com.cineverse.gateway`  
**Purpose:** Spring Boot application entry point  
**Key Content:**
- `public static void main(String[] args)` - Application entry point
- Startup banner with route information
- Logs all available endpoints

**Class Type:** Main Application Class  
**Extends:** None  
**Implements:** None  
**Key Methods:**
- `main(String[] args)` - Starts the Spring Boot application

**Dependencies:**
- Spring Boot 3.1.5
- Spring Cloud Gateway

**Important Notes:**
- Entry point for the entire gateway application
- Runs on port 8080 (configurable)
- Displays helpful startup banner

**When to modify:** Adding new startup logic or configuration

---

### GatewayRouteConfig.java
**Location:** `src/main/java/com/cineverse/gateway/config/`  
**Purpose:** Defines all API Gateway routes  
**Key Content:**
- Route definitions using RouteLocatorBuilder
- 5 main routes (register, login, protected auth, movies, reviews)
- JWT filter application to protected routes
- Service URL configuration from properties

**Class Type:** Configuration Class (@Configuration)  
**Key Methods:**
- `customRouteLocator(RouteLocatorBuilder builder)` - Defines all routes
  - Route 1: `/auth/register` (public, POST)
  - Route 2: `/auth/login` (public, POST)
  - Route 3: `/auth/**` (protected, all methods)
  - Route 4: `/movies/**` (protected, all methods)
  - Route 5: `/reviews/**` (protected, all methods)

**Fields:**
- `authServiceUrl` - Injected from properties
- `movieServiceUrl` - Injected from properties
- `reviewServiceUrl` - Injected from properties
- `jwtFilter` - JWT validation filter

**Dependencies:**
- Spring Cloud Gateway RouteLocatorBuilder
- JwtFilter

**Important Notes:**
- Central configuration for all routing logic
- Public routes (register, login) don't have JWT filter
- Protected routes have JWT filter applied
- Service URLs come from application.properties

**When to modify:** Adding new routes or changing service URLs

**Routes Defined:**
```
/auth/register → Auth Service (no JWT)
/auth/login    → Auth Service (no JWT)
/auth/**       → Auth Service (with JWT)
/movies/**     → Movie Service (with JWT)
/reviews/**    → Review Service (with JWT)
```

---

### JwtFilter.java
**Location:** `src/main/java/com/cineverse/gateway/filter/`  
**Purpose:** Custom gateway filter for JWT token validation  
**Key Content:**
- Extracts JWT from Authorization header
- Validates token using JwtUtil
- Returns 401 for invalid/missing tokens
- Logs token validation results

**Class Type:** Custom Gateway Filter (@Component extends AbstractGatewayFilterFactory)  
**Config Class:** `JwtFilter.Config` (empty, for future use)

**Key Methods:**
- `apply(Config config)` - Creates the actual filter function
  - Extracts "Authorization: Bearer <token>" header
  - Calls JwtUtil.validateToken(token)
  - Returns 401 if invalid
  - Extracts email and role for logging
  - Continues to next filter if valid

**Process Flow:**
1. Check if Authorization header exists and starts with "Bearer "
2. Extract token (remove "Bearer " prefix)
3. Call JwtUtil.validateToken(token)
4. If valid: extract email and role, log, continue
5. If invalid: return 401 Unauthorized

**Important Notes:**
- Applied only to protected routes (not /auth/register, /auth/login)
- Returns 401 without Authorization header
- Returns 401 with invalid token
- Logs successful validations for debugging

**When to modify:** Changing JWT validation logic or adding role-based routing

---

### LoggingFilter.java
**Location:** `src/main/java/com/cineverse/gateway/filter/`  
**Purpose:** Global filter for logging all incoming requests  
**Key Content:**
- Logs HTTP method (GET, POST, etc.)
- Logs request path (/auth/login, /movies, etc.)
- Logs query parameters if present
- Nicely formatted output with borders

**Class Type:** Configuration Class (@Configuration)  
**Key Methods:**
- `logRequestAndResponse()` - Creates GlobalFilter bean
  - Returns GlobalFilter that logs all requests
  - Calls `chain.filter(exchange)` to continue

**Output Example:**
```
╔════════════════════════════════════════╗
║ INCOMING REQUEST                       ║
╠════════════════════════════════════════╣
║ Method: POST                           ║
║ Path:   /auth/login                    ║
╚════════════════════════════════════════╝
```

**Helper Methods:**
- `padRight(String s, int length)` - Formats strings for nice alignment

**Important Notes:**
- Runs for ALL requests (global filter)
- Useful for debugging and monitoring
- Logs are printed to console (System.out)
- Can be extended to log response status and time

**When to modify:** Adding more logging (response time, status code, etc.)

---

### JwtUtil.java
**Location:** `src/main/java/com/cineverse/gateway/security/`  
**Purpose:** JWT token validation utility  
**Key Content:**
- Validates JWT token signature
- Checks token expiration
- Extracts email (subject) from token
- Extracts role from token claims

**Class Type:** Component (@Component)  
**Key Methods:**
- `validateToken(String token)` - Returns boolean
  - Uses HMAC-SHA256 signature validation
  - Parses token using JJWT library
  - Returns true if valid, false if invalid or expired
  - Catches and logs any exceptions

- `getEmailFromToken(String token)` - Returns String
  - Extracts "subject" claim (contains email)
  - Returns null if extraction fails

- `getRoleFromToken(String token)` - Returns String
  - Extracts "role" claim
  - Returns null if extraction fails

**Fields:**
- `jwtSecret` - Injected from application.properties
  - Same secret used by Auth Service
  - Used to create HMAC key for validation

**Important Notes:**
- Uses JJWT 0.12.3 library
- Keys.hmacShaKeyFor(jwtSecret.getBytes()) creates signing key
- Same secret must be used in Auth Service
- Token validation includes signature and expiration check
- Exception handling is broad (catches all exceptions)

**When to modify:** Changing token format or adding new claims

---

## 🔧 Configuration Files

### pom.xml
**Purpose:** Maven project configuration and dependencies  
**Key Sections:**
- Parent POM: Spring Boot 3.1.5
- Group ID: com.cineverse
- Artifact ID: gateway
- Version: 1.0.0

**Java Version:** 21  
**Spring Cloud Version:** 2022.0.4

**Key Dependencies:**
1. **spring-cloud-starter-gateway** - API Gateway
2. **spring-boot-starter-security** - Security framework
3. **jjwt** - JWT library (3 parts: api, impl, jackson)
4. **lombok** - Reduces boilerplate
5. **spring-boot-devtools** - Auto-restart during development
6. **spring-boot-starter-test** - Testing framework

**Plugins:**
- spring-boot-maven-plugin - Builds executable JAR

**When to modify:** Adding new dependencies

---

### application.properties
**Purpose:** Runtime configuration  
**Location:** `src/main/resources/`

**Key Settings:**

| Property | Value | Purpose |
|----------|-------|---------|
| `server.port` | 8080 | Gateway server port |
| `spring.application.name` | gateway | Application name |
| `auth.service.url` | http://localhost:8081 | Auth Service location |
| `movie.service.url` | http://localhost:8082 | Movie Service location |
| `review.service.url` | http://localhost:8083 | Review Service location |
| `app.jwt.secret` | (long string) | JWT validation secret |
| `app.jwt.expiration` | 86400000 | Token expiration (24 hours) |
| `logging.level.root` | INFO | Default log level |
| `logging.level.com.cineverse.gateway` | DEBUG | Gateway-specific logging |

**When to modify:** Changing service URLs, ports, JWT secret, or logging levels

---

## 📚 Quick Reference

### How to Find What You Need

| Need | File | Section |
|------|------|---------|
| Quick overview | README.md | Top section |
| Setup instructions | GATEWAY_SETUP_AND_TESTING_GUIDE.md | Setup Steps |
| Route definitions | GatewayRouteConfig.java | customRouteLocator method |
| JWT validation logic | JwtFilter.java | apply method |
| JWT token parsing | JwtUtil.java | validateToken method |
| Request logging | LoggingFilter.java | logRequestAndResponse bean |
| Dependencies | pom.xml | dependencies section |
| Service URLs | application.properties | auth.service.url, etc. |
| Testing examples | GATEWAY_SETUP_AND_TESTING_GUIDE.md | Testing Guide section |
| Troubleshooting | PRE_LAUNCH_CHECKLIST.md | Troubleshooting section |
| Before startup | PRE_LAUNCH_CHECKLIST.md | All sections |

---

## 🎯 By Task

### If you want to...

**Start the gateway:**
- Read: README.md → Quick Start
- Follow: PRE_LAUNCH_CHECKLIST.md

**Understand how requests flow:**
- Read: GATEWAY_SETUP_AND_TESTING_GUIDE.md → How It Works

**Change service URLs:**
- Modify: application.properties
- Update: `auth.service.url`, `movie.service.url`, `review.service.url`

**Change gateway port:**
- Modify: application.properties
- Change: `server.port=8080` to desired port

**Change JWT secret:**
- Modify: application.properties
- Change: `app.jwt.secret=...`
- Important: Must match Auth Service secret

**Add new route:**
- Edit: GatewayRouteConfig.java → customRouteLocator method
- Add: new `.route()` definition

**Change JWT validation:**
- Edit: JwtFilter.java → apply method
- Or: JwtUtil.java → validateToken method

**Add more logging:**
- Edit: LoggingFilter.java → logRequestAndResponse method
- Add: more System.out.println statements

**Test the gateway:**
- Follow: GATEWAY_SETUP_AND_TESTING_GUIDE.md → Testing Guide
- Use: Provided curl examples or Postman collection

---

## 📊 File Statistics

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| GatewayApplication.java | Java | ~30 | Entry point |
| GatewayRouteConfig.java | Java | ~100 | Route config |
| JwtFilter.java | Java | ~70 | JWT validation |
| LoggingFilter.java | Java | ~40 | Request logging |
| JwtUtil.java | Java | ~100 | JWT utility |
| pom.xml | XML | ~80 | Maven config |
| application.properties | Properties | ~30 | Runtime config |
| README.md | Markdown | ~250 | Quick reference |
| GATEWAY_SETUP_AND_TESTING_GUIDE.md | Markdown | ~800 | Setup & testing |
| PRE_LAUNCH_CHECKLIST.md | Markdown | ~400 | Verification |
| FILE_INDEX.md | Markdown | ~300 | Navigation |

**Total Java Code:** ~340 lines  
**Total Documentation:** ~1,750 lines  
**Total Project:** ~2,250 lines

---

## ✅ Summary

The gateway consists of:
- **5 Java files** for core functionality
- **2 configuration files** for setup
- **5 documentation files** for guidance

All files are interconnected to provide a complete, well-documented API Gateway solution for CineVerse.

---

**For more details, see the specific documentation files listed above.**
