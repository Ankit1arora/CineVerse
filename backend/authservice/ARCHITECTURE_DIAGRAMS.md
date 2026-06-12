# CineVerse Authentication Service - Architecture & Flow Diagrams

## 🏗️ Project Architecture

### Layered Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT / FRONTEND                         │
│            (React/Web App sending HTTP requests)                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    HTTP Request │ HTTP Response
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    🌐 API GATEWAY / CONTROLLER LAYER             │
│                                                                   │
│   AuthController.java                                            │
│   ├── POST /auth/register  ────────────────────────┐            │
│   ├── POST /auth/login     ────────────────────────┤            │
│   ├── GET /auth/public/test                        │            │
│   ├── GET /auth/protected/test                     │            │
│   ├── GET /auth/admin/test     ──┐                 │            │
│   └── GET /auth/user/test        │                 │            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                          Delegates to
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│               ⚙️ SERVICE LAYER (BUSINESS LOGIC)                  │
│                                                                   │
│   AuthService.java                                              │
│   ├── register(RegisterRequest)                                 │
│   │   ├─ Validate email uniqueness                             │
│   │   ├─ Encode password with BCrypt                           │
│   │   └─ Save to database via Repository                       │
│   │                                                              │
│   └── login(LoginRequest)                                       │
│       ├─ Find user by email                                    │
│       ├─ Verify password with BCrypt                           │
│       └─ Generate JWT token                                    │
│                                                                   │
│   JwtUtil.java                                                  │
│   ├── generateToken(email, role)                               │
│   ├── validateToken(token)                                     │
│   ├── getEmailFromToken(token)                                 │
│   └── getRoleFromToken(token)                                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                          Delegates to
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│              💾 DATA ACCESS LAYER (REPOSITORY)                   │
│                                                                   │
│   UserRepository.java                                           │
│   ├── save(User)           ──────────────────────────┐         │
│   ├── findByEmail(email)   ──────────────────────────┤         │
│   └── existsByEmail(email) ──────────────────────────┤         │
│                                                        │         │
│   (JPA automatically implements these methods)        │         │
└────────────────────────────────┬─────────────────────┼─────────┘
                                 │                      │
                   SQL Query      │                      │
                                 │                      │
┌────────────────────────────────▼──────────────────────▼─────────┐
│           🗄️  DATABASE LAYER (POSTGRESQL)                        │
│                                                                   │
│   users table                                                    │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ id (BIGINT) │ name │ email │ password │ role       │       │
│   ├──────────────────────────────────────────────────────│       │
│   │ 1           │Ankit │ankit@ │ $2a$... │ USER       │       │
│   │ 2           │Admin │admin@ │ $2a$... │ ADMIN      │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                   │
│   Constraints:                                                   │
│   - id: PRIMARY KEY (auto-increment)                            │
│   - email: UNIQUE, NOT NULL                                     │
│   - password: BCrypt hash, NOT NULL                             │
│   - role: ENUM (USER, ADMIN)                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INCOMING HTTP REQUEST                         │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    Authorization: Bearer eyJ...
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│         🛡️ JwtAuthenticationFilter (Security Filter)            │
│                                                                   │
│  1. Extract JWT from Authorization header                        │
│  2. Call JwtUtil.validateToken(token)                           │
│  3. If valid:                                                    │
│     - Extract email: JwtUtil.getEmailFromToken()               │
│     - Extract role: JwtUtil.getRoleFromToken()                 │
│     - Create UsernamePasswordAuthenticationToken                │
│     - Set in SecurityContextHolder                             │
│  4. If invalid:                                                  │
│     - Log error                                                 │
│     - Continue to next filter (request becomes unauthenticated) │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                            Token valid?
                       ┌────────┴────────┐
                      YES               NO
                       │                 │
┌──────────────────────▼──┐    ┌─────────▼──────────────┐
│ User Authenticated     │    │ Unauthenticated       │
│ Proceed to endpoint    │    │ (May access public    │
│                       │    │  endpoints only)      │
└──────────────────────┬──┘    └─────────┬──────────────┘
                      │                  │
                      └─────────┬────────┘
                                │
┌────────────────────────────────▼────────────────────────────────┐
│         🔒 Spring Security Authorization Check                   │
│                                                                   │
│  Check @PreAuthorize and endpoint permissions:                  │
│  ├── /auth/register          → @PermitAll (public)             │
│  ├── /auth/login             → @PermitAll (public)             │
│  ├── /auth/public/test       → @PermitAll (public)             │
│  ├── /auth/protected/test    → @Authenticated (any role)       │
│  ├── /auth/admin/test        → @PreAuthorize("hasRole('ADMIN')")│
│  └── /auth/user/test         → @PreAuthorize("hasRole('USER')")│
│                                                                   │
│  If authorization fails → 403 Forbidden                         │
│  If authorized → Proceed to Controller                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    CONTROLLER METHOD EXECUTED                    │
│                                                                   │
│              Request successfully processed                       │
│              Response returned to client                         │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📊 User Registration Flow

```
START
  │
  ├──────────────────────────────────────────────────────────────┐
  │                                                              │
  ▼ User sends registration request                              │
┌─────────────────────────────────────────┐                      │
│ POST /auth/register                     │                      │
│ {                                       │                      │
│   "name": "Ankit",                      │                      │
│   "email": "ankit@gmail.com",           │                      │
│   "password": "123456",                 │                      │
│   "role": "USER"                        │                      │
│ }                                       │                      │
└──────────────────────┬──────────────────┘                      │
                       │                                         │
                       ▼                                         │
              ┌────────────────────┐                             │
              │ Validate Request   │◄────────────────────────────┘
              │ (Spring Validation)│
              │ - Email format     │
              │ - Password length  │
              └────────┬───────────┘
                       │
                    Valid?
                   ┌──┴──┐
                  YES   NO
                   │     │
                   │     ▼
                   │  ┌─────────────────────────┐
                   │  │ 400 Bad Request         │
                   │  │ Return error message    │
                   │  │ END (Validation failed) │
                   │  └─────────────────────────┘
                   │
                   ▼
         ┌─────────────────────────────┐
         │ Check if email exists       │
         │ userRepository              │
         │ .existsByEmail(email)       │
         └─────────────┬───────────────┘
                       │
                   Exists?
                   ┌──┴──┐
                  YES   NO
                   │     │
                   │     ▼
                   ▼  ┌──────────────────────────┐
         ┌─────────┐  │ Encode password          │
         │ 400 Bad │  │ passwordEncoder          │
         │ Request │  │ .encode(rawPassword)    │
         │ Email   │  │ Result: $2a$10$abc...   │
         │ already │  └───────────┬──────────────┘
         │ exists! │              │
         └─────────┘              ▼
              │         ┌──────────────────────────┐
              │         │ Create User entity       │
              │         │ user.setEmail(email)     │
              │         │ user.setPassword(hash)   │
              │         │ user.setRole(USER)       │
              │         └───────────┬──────────────┘
              │                     │
              │                     ▼
              │         ┌──────────────────────────┐
              │         │ Save User to Database    │
              │         │ userRepository.save()    │
              │         │ INSERT INTO users...     │
              │         └───────────┬──────────────┘
              │                     │
              │                     ▼
              │         ┌──────────────────────────┐
              │         │ Generate JWT token       │
              │         │ jwtUtil.generateToken()  │
              │         │ Claims:                  │
              │         │ - subject: ankit@g...   │
              │         │ - role: USER             │
              │         │ - exp: 1702109400       │
              │         │ Signed with secret key   │
              │         └───────────┬──────────────┘
              │                     │
              └─────────────┬───────┘
                            │
                            ▼
                ┌─────────────────────────────┐
                │ 201 Created                 │
                │ Return AuthResponse:        │
                │ {                           │
                │   token: "eyJ...",          │
                │   message: "Success!",      │
                │   role: "USER"              │
                │ }                           │
                │ END (Success)               │
                └─────────────────────────────┘
```

---

## 📊 User Login Flow

```
START
  │
  ▼ User sends login request
┌─────────────────────────────────┐
│ POST /auth/login                │
│ {                               │
│   "email": "ankit@gmail.com",   │
│   "password": "123456"          │
│ }                               │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────────────┐
        │ Validate Input   │
        │ - Email format   │
        │ - Not blank      │
        └────────┬─────────┘
                 │
              Valid?
             ┌──┴──┐
            YES   NO
             │     │
             │     ▼
             │  ┌─────────────────┐
             │  │ 400 Bad Request │
             │  │ Return error    │
             │  │ END             │
             │  └─────────────────┘
             │
             ▼
      ┌──────────────────────┐
      │ Find User by Email   │
      │ userRepository       │
      │ .findByEmail(email)  │
      └────────┬─────────────┘
               │
          Found?
         ┌──┴──┐
        YES   NO
         │     │
         │     ▼
         │  ┌──────────────────────┐
         │  │ 401 Unauthorized     │
         │  │ "User not found!"    │
         │  │ END                  │
         │  └──────────────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │ Verify Password             │
    │ passwordEncoder.matches(    │
    │   providedPassword,         │
    │   storedBCryptHash          │
    │ )                           │
    │                             │
    │ BCrypt comparison:          │
    │ "123456" vs "$2a$10$abc.."  │
    └────────┬────────────────────┘
             │
         Matches?
        ┌──┴──┐
       YES   NO
        │     │
        │     ▼
        │  ┌──────────────────────┐
        │  │ 401 Unauthorized     │
        │  │ "Invalid password!"  │
        │  │ END                  │
        │  └──────────────────────┘
        │
        ▼
    ┌──────────────────────┐
    │ Generate JWT Token   │
    │ jwtUtil.generateToken│
    │ (email, role)        │
    │                      │
    │ Header: {alg: HS256} │
    │ Payload: {           │
    │   sub: email,        │
    │   role: role,        │
    │   iat: now,          │
    │   exp: now + 24h     │
    │ }                    │
    │ Signature: HMAC-SHA  │
    │ Result: eyJ...       │
    └────────┬─────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ 200 OK                 │
    │ Return AuthResponse:   │
    │ {                      │
    │   token: "eyJ...",     │
    │   message: "Success!", │
    │   role: "USER"         │
    │ }                      │
    │ END (Login successful) │
    └────────────────────────┘
```

---

## 🔄 JWT Token Validation Flow

```
START
  │
  ▼ Request arrives with JWT token
┌─────────────────────────────────────┐
│ Authorization: Bearer eyJhbGc...   │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌────────────────────────┐
    │ JwtAuthenticationFilter│
    │ Intercepts request     │
    └────────────┬───────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ Extract Authorization header │
    │ authHeader.substring(7)       │
    │ Remove "Bearer " prefix       │
    │                               │
    │ Extracted: eyJhbGc...         │
    └────────────┬──────────────────┘
                 │
                 ▼
    ┌───────────────────────────┐
    │ Call JwtUtil              │
    │ .validateToken(token)     │
    └────────────┬──────────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │ Parse JWT with secret key       │
    │ Jwts.parserBuilder()            │
    │ .setSigningKey(secret)          │
    │ .build()                        │
    │ .parseClaimsJws(token)          │
    │                                 │
    │ Three steps:                    │
    │ 1. Decode header/payload        │
    │ 2. Recalculate signature        │
    │ 3. Compare signatures           │
    └────────────┬────────────────────┘
                 │
             Valid?
            ┌──┴──┐
           YES   NO
            │     │
            │     ▼
            │  ┌──────────────────┐
            │  │ Signature invalid│
            │  │ or parsing error │
            │  │ Return false     │
            │  │ Token rejected   │
            │  └──────────────────┘
            │
            ▼
    ┌────────────────────────────┐
    │ Check Expiration           │
    │ getExpiration().isBefore() │
    │ now                        │
    │                            │
    │ If expired: return false   │
    │ If valid: continue         │
    └────────────┬───────────────┘
                 │
            Valid?
            ┌──┴──┐
           YES   NO
            │     │
            │     ▼
            │  ┌──────────────────┐
            │  │ Token expired    │
            │  │ Return false     │
            │  │ User cannot access│
            │  └──────────────────┘
            │
            ▼
    ┌──────────────────────────┐
    │ Extract Claims           │
    │ getClaimsFromToken()     │
    │                          │
    │ Extract email:           │
    │ getSubject()             │
    │ ankit@gmail.com          │
    │                          │
    │ Extract role:            │
    │ get("role")              │
    │ USER                     │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌─────────────────────────────┐
    │ Create Authentication       │
    │ UsernamePasswordAuthToken   │
    │                             │
    │ principal: email            │
    │ credentials: null           │
    │ authorities: [ROLE_USER]    │
    └────────────┬────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ Set in SecurityContext       │
    │ SecurityContextHolder        │
    │ .getContext()                │
    │ .setAuthentication()         │
    │                              │
    │ Request now carries:         │
    │ - Authenticated user: ankit@ │
    │ - Role: USER                 │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Continue to Controller   │
    │                          │
    │ Controller can access:   │
    │ - User email             │
    │ - User role              │
    │ - Has ROLE_USER          │
    │ - Has ROLE_ADMIN: false  │
    │                          │
    │ Check @PreAuthorize:     │
    │ If role matches: execute │
    │ If role doesn't match:   │
    │   403 Forbidden          │
    └─────────────────────────┘
```

---

## 🔐 Password Encoding Process

```
User Password: "123456"
        │
        ▼
┌─────────────────────────────────┐
│ BCryptPasswordEncoder            │
│ .encode(rawPassword)             │
│                                  │
│ Algorithm: bcrypt (cost: 10)     │
│                                  │
│ Steps:                           │
│ 1. Generate random salt          │
│    Salt: $2a$10$abc123...       │
│                                  │
│ 2. Hash password with salt       │
│    Input: "123456" + salt        │
│    Output: hashedValue           │
│                                  │
│ 3. Combine cost + salt + hash    │
│    Result: $2a$10$N9q...full..  │
│                                  │
│ 4. Return complete BCrypt string │
└────────────────┬────────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ BCrypt Hash String       │
    │ (stored in database)     │
    │                          │
    │ $2a$10$abc123xyz...      │
    │ Format breakdown:        │
    │ $2a     : bcrypt version │
    │ $10     : cost factor    │
    │ $abc... : salt           │
    │ xyz...  : encrypted hash │
    └──────────────────────────┘

=== During Login ===

User provides: "123456"
Stored hash: $2a$10$N9qz...

        │
        ▼
┌─────────────────────────────────┐
│ BCryptPasswordEncoder            │
│ .matches(rawPassword, hash)      │
│                                  │
│ Process:                         │
│ 1. Extract salt from hash        │
│ 2. Hash raw password with salt   │
│ 3. Compare with stored hash      │
│ 4. If equal: passwords match     │
│ 5. If different: passwords don't │
└────────────────┬────────────────┘
                 │
         Passwords match?
            ┌────┴────┐
           YES       NO
            │         │
            ▼         ▼
        ┌─────┐  ┌─────────┐
        │ ✅  │  │ ❌      │
        │Auth │  │Rejected │
        │OK   │  │         │
        └─────┘  └─────────┘

Key Points:
- Same password different hash (because of salt)
- Hash cannot be reversed
- Cost factor (10) = 2^10 iterations
- Increase cost for future-proofing
```

---

## 📊 Token Structure

```
JWT Token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmtpdEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwMjAyMzAwMCwiZXhwIjoxNzAyMTA5NDAwfQ.abcdefghijk

         │                    │                                │
         │                    │                                │
     ┌───┘                    │                                │
     │                        │                                │
  HEADER                   PAYLOAD                        SIGNATURE
     │                        │                                │
     ▼                        ▼                                ▼
┌─────────────┐          ┌──────────────┐           ┌──────────────┐
│ {           │          │ {            │           │ Base64(      │
│  alg:       │          │  sub:        │           │  HMAC-SHA256(│
│  "HS256"    │          │  "ankit@...  │           │  header +    │
│ }           │          │  role:       │           │  "." +       │
│             │          │  "USER",     │           │  payload,    │
│ ALGORITHMS  │          │  iat:        │           │  secret_key) │
│ USED FOR    │          │  1702023000, │           │ )            │
│ SIGNING     │          │  exp:        │           │              │
│             │          │  1702109400  │           │ SIGNATURE    │
│             │          │ }            │           │ ensures:     │
│             │          │              │           │ - Integrity  │
│             │          │ CLAIMS:      │           │ - Authenticy │
│             │          │ - sub: email │           │              │
│             │          │ - role: role │           │ Tampered? ❌ │
│             │          │ - iat: issued│           │ Invalid?  ❌ │
│             │          │ - exp: expiry│           │              │
│             │          └──────────────┘           └──────────────┘
└─────────────┘

Base64 Encoded (NOT encrypted):
- Readable but requires decoding
- Anyone can see claims
- BUT cannot modify without secret key

Signature:
- Created with secret key (only server knows)
- Validates token hasn't been tampered with
- If someone modifies claims, signature won't match
- Server rejects invalid signature
```

---

## 📦 Class Relationships Diagram

```
┌─────────────────────────────────┐
│     AuthController              │
│  (Handles HTTP requests)         │
└────────────┬────────────────────┘
             │ uses
             ▼
┌─────────────────────────────────┐
│     AuthService                 │
│  (Business logic)                │
└────────────┬────────────────────┘
             │ uses
        ┌────┴────┬─────────────┐
        │          │             │
        ▼          ▼             ▼
┌──────────────┐ ┌──────┐ ┌────────────┐
│UserRepository│ │JwtUtil│ │PasswordEnc.│
│(DB queries)  │ │(JWT ops)│(BCrypt)   │
└──────────────┘ └──────┘ └────────────┘

┌─────────────────────────────────┐
│   RegisterRequest (DTO)         │
│   - name: String                │
│   - email: String               │
│   - password: String            │
│   - role: String                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   User (Entity)                 │
│   - id: Long                    │
│   - name: String                │
│   - email: String (unique)      │
│   - password: String (BCrypt)   │
│   - role: UserRole (enum)       │
└─────────────────────────────────┘
     │
     │ maps to
     ▼
┌─────────────────────────────────┐
│   users (Database Table)        │
│   - id BIGINT PRIMARY KEY       │
│   - name VARCHAR                │
│   - email VARCHAR UNIQUE        │
│   - password VARCHAR            │
│   - role VARCHAR                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ SecurityConfig                  │
│ - Creates PasswordEncoder bean  │
│ - Registers JwtFilter           │
│ - Configures endpoints          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ JwtAuthenticationFilter         │
│ - Intercepts requests           │
│ - Validates JWT tokens          │
│ - Sets authentication           │
└─────────────────────────────────┘
```

---

## 🎯 Authorization Flow

```
Request arrives at Controller
        │
        ▼
┌────────────────────────────────────┐
│ Check @PreAuthorize annotation     │
│ OR                                 │
│ Check @PermitAll                   │
│ OR                                 │
│ Check endpoint config              │
└────────────────┬───────────────────┘
                 │
         ┌───────┴────────────┬────────────────┐
         │                    │                │
    Public endpoint?   Requires Auth?  Requires Role?
         │                    │                │
         ▼                    ▼                ▼
    ┌────────────┐  ┌────────────────┐ ┌──────────────┐
    │ Allow:     │  │ Check if       │ │ Check if user│
    │ No token   │  │ token exists   │ │ has role:    │
    │ needed     │  │ & is valid     │ │ ADMIN? USER? │
    │            │  │                │ │              │
    │User can    │  │ If yes: allow  │ │ Match?:      │
    │access      │  │ If no: 401     │ │ YES: allow   │
    │directly    │  │                │ │ NO: 403      │
    └────────────┘  └────────────────┘ └──────────────┘
         │                    │                │
         └────────┬───────────┴────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Execute Endpoint │
         │ OR               │
         │ Return Error     │
         │ 401/403/404      │
         └──────────────────┘
```

---

## 📋 Data Flow Summary

```
REGISTRATION:
RegisterRequest 
  → Validation 
  → AuthService.register() 
  → BCrypt encode 
  → UserRepository.save() 
  → PostgreSQL 
  → Generate JWT 
  → AuthResponse

LOGIN:
LoginRequest 
  → Validation 
  → AuthService.login() 
  → Find user 
  → BCrypt.matches() 
  → Generate JWT 
  → AuthResponse

PROTECTED REQUEST:
JWT Token 
  → JwtAuthenticationFilter 
  → Validate signature 
  → Check expiration 
  → Extract claims 
  → SecurityContext 
  → Controller 
  → Check authorization 
  → Response

DATABASE:
PostgreSQL 
  → JPA/Hibernate 
  → UserRepository 
  → Find/Save/Update 
  → Result mapped to User entity
```

---

## ✨ Complete Flow Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                             │
│                                                                  │
│  1. Send POST /auth/register or /auth/login                    │
│  2. Receive JWT token                                          │
│  3. Store token (localStorage or sessionStorage)               │
│  4. Send token in Authorization header for future requests     │
└──────────────┬───────────────────────────────────────────────────┘
               │
               │ HTTP Request
               │
┌──────────────▼───────────────────────────────────────────────────┐
│               SPRING BOOT SERVER                                 │
│                                                                  │
│  JwtAuthenticationFilter ─→ Validate JWT ─→ SecurityContext    │
│  AuthController ─→ AuthService ─→ Business Logic               │
│  UserRepository ─→ PostgreSQL ─→ Data Persistence              │
│  JwtUtil ─→ Generate/Validate Tokens                           │
│  SecurityConfig ─→ Manage permissions                          │
└──────────────┬───────────────────────────────────────────────────┘
               │
               │ HTTP Response + JWT
               │
└──────────────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ **Secure Authentication**: BCrypt password encoding
- ✅ **Scalable Authorization**: JWT-based, stateless
- ✅ **Clean Code**: Separated layers and concerns
- ✅ **Type Safety**: Enums and proper data types
- ✅ **Error Handling**: Proper HTTP status codes
- ✅ **Role-Based Access**: Different endpoints for different roles

---

**Ready for production-grade authentication in CineVerse!**
