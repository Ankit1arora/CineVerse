# CineVerse Authentication Service - Pre-Launch Checklist

## ✅ Pre-Launch Verification

Use this checklist before running the application for the first time.

---

## 1️⃣ System Requirements Check

- [ ] Java 21 is installed: `java -version`
- [ ] Maven 3.8+ is installed: `mvn -version`
- [ ] PostgreSQL 12+ is installed: `psql --version`
- [ ] Git is installed (optional): `git --version`

---

## 2️⃣ PostgreSQL Database Setup

### Create Database

```sql
-- Login to PostgreSQL
psql -U postgres

-- Run these commands:
CREATE DATABASE authservice_db;
GRANT ALL PRIVILEGES ON DATABASE authservice_db TO postgres;
\q
```

- [ ] Database `authservice_db` created
- [ ] Logged in as user `postgres`
- [ ] Can connect to database: `psql -U postgres -d authservice_db`

---

## 3️⃣ Application Configuration

### Update application.properties

**File**: `src/main/resources/application.properties`

**Required Changes:**

```properties
# ✅ Change these values to match your setup:

spring.datasource.url=jdbc:postgresql://localhost:5432/authservice_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE  # ⚠️ CHANGE THIS!

# JWT Secret (optional, but recommended):
app.jwt.secret=mySecretKeyForJWTTokenGenerationChangeMeInProduction12345678
# In production, use a strong random key!
```

- [ ] Database URL is correct
- [ ] PostgreSQL username is set
- [ ] PostgreSQL password is set
- [ ] JWT secret is configured
- [ ] File saved after changes

**To verify PostgreSQL password:**
```bash
psql -U postgres -d authservice_db -c "SELECT 1;"
```

If connection fails, password is incorrect.

---

## 4️⃣ Project Structure Verification

Verify the project structure is complete:

```
authservice/
├── pom.xml                                 ✅
├── README.md                               ✅
├── PROJECT_SUMMARY.md                      ✅
├── SETUP_AND_TESTING_GUIDE.md              ✅
├── ARCHITECTURE_DIAGRAMS.md                ✅
├── FILE_INDEX.md                           ✅
├── PRE_LAUNCH_CHECKLIST.md                 ✅
│
└── src/main/
    ├── java/com/cineverse/authservice/
    │   ├── AuthServiceApplication.java     ✅
    │   ├── controller/
    │   │   └── AuthController.java         ✅
    │   ├── service/
    │   │   └── AuthService.java            ✅
    │   ├── repository/
    │   │   └── UserRepository.java         ✅
    │   ├── entity/
    │   │   ├── User.java                   ✅
    │   │   └── UserRole.java               ✅
    │   ├── dto/
    │   │   ├── RegisterRequest.java        ✅
    │   │   ├── LoginRequest.java           ✅
    │   │   └── AuthResponse.java           ✅
    │   ├── security/
    │   │   ├── JwtUtil.java                ✅
    │   │   └── JwtAuthenticationFilter.java✅
    │   └── config/
    │       └── SecurityConfig.java         ✅
    │
    └── resources/
        └── application.properties          ✅
```

- [ ] All files exist as shown above
- [ ] No files are missing
- [ ] Folder structure matches

---

## 5️⃣ Maven Dependencies Installation

### Clean Build

```bash
cd backend/authservice
mvn clean
```

- [ ] Command executed successfully
- [ ] No errors in output

### Install Dependencies

```bash
mvn install
```

Expected output includes:
- Downloaded spring-boot-starter-web
- Downloaded spring-boot-starter-security
- Downloaded postgresql
- Downloaded jjwt (JWT library)
- Downloaded lombok
- BUILD SUCCESS

- [ ] `BUILD SUCCESS` in output
- [ ] No compilation errors
- [ ] All dependencies downloaded

**If build fails:**
- Check internet connection
- Check Java version: `java -version`
- Try: `mvn install -U` (force update)

---

## 6️⃣ Database Tables Verification

After first run, verify tables are created:

```bash
psql -U postgres -d authservice_db

-- Inside PostgreSQL:
\dt                    # List all tables

-- You should see:
# public | users | table

\d users               # Describe users table

-- You should see columns:
# id         | bigint
# name       | character varying
# email      | character varying
# password   | character varying
# role       | character varying
```

- [ ] `users` table exists
- [ ] All columns present (id, name, email, password, role)
- [ ] Email column is UNIQUE
- [ ] ID is PRIMARY KEY

---

## 7️⃣ IDE Setup (VS Code)

### Required Extensions

Install these VS Code extensions:

- [ ] Extension Pack for Java (Microsoft)
- [ ] Spring Boot Extension Pack (VMware)
- [ ] REST Client (Huachao Mao) - Optional, for testing
- [ ] Postman - For API testing

**To install extensions:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for extension name
4. Click Install

---

## 8️⃣ Environment Variables (Optional)

### For Windows PowerShell

```powershell
# Set environment variables
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/authservice_db"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="password"
$env:APP_JWT_SECRET="your_secret_key"
```

### For Linux/Mac Bash

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/authservice_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=password
export APP_JWT_SECRET=your_secret_key
```

- [ ] Environment variables set (optional)

---

## 9️⃣ Port Availability Check

Check if port 8080 is available:

### Windows PowerShell
```powershell
netstat -ano | findstr :8080
```
Should return nothing (port is free)

### Linux/Mac
```bash
lsof -i :8080
```
Should return nothing (port is free)

If port is in use, change in `application.properties`:
```properties
server.port=8081
```

- [ ] Port 8080 is available (or alternative port configured)

---

## 🔟 Pre-Launch Debugging Setup

### Enable Debug Logging

Optional: To see detailed debug output:

Edit `src/main/resources/application.properties`:
```properties
logging.level.root=DEBUG
logging.level.com.cineverse.authservice=DEBUG
```

- [ ] (Optional) Debug logging enabled

### Postman Setup

1. [ ] Postman installed
2. [ ] Create new workspace
3. [ ] Create collection "CineVerse Auth"
4. [ ] Create environment "local"
5. [ ] Set variables:
   - [ ] `base_url` = `http://localhost:8080`
   - [ ] `userToken` = (empty, will be filled after login)
   - [ ] `adminToken` = (empty, will be filled after admin login)

---

## 1️⃣1️⃣ Final Verification Checklist

Before running the application:

- [ ] Java version is 21 or higher
- [ ] Maven is installed (3.8+)
- [ ] PostgreSQL is running
- [ ] Database `authservice_db` created
- [ ] User `postgres` has database privileges
- [ ] `application.properties` has correct database credentials
- [ ] `pom.xml` has all dependencies
- [ ] Project structure is complete
- [ ] `mvn clean install` completes successfully
- [ ] Port 8080 is available
- [ ] IDE setup complete (VS Code with Java extensions)
- [ ] Postman ready for testing

---

## 🚀 Ready to Launch!

If all checkboxes are checked, you're ready to start the application:

### Start the Application

```bash
cd backend/authservice
mvn spring-boot:run
```

**Expected Output:**
```
Tomcat started on port(s): 8080 (http)
AuthServiceApplication started in X.XXX seconds
```

### Verify Application is Running

**Test 1: Open browser**
```
http://localhost:8080/auth/public/test
```
Should return:
```
This is a public endpoint - No authentication required!
```

**Test 2: Using curl**
```bash
curl http://localhost:8080/auth/public/test
```

- [ ] Application started successfully
- [ ] Public endpoint accessible

---

## 🛠️ Troubleshooting Quick Links

### Database Connection Error
- File: `SETUP_AND_TESTING_GUIDE.md`
- Section: Troubleshooting → Issue 1

### Port Already in Use
- File: `SETUP_AND_TESTING_GUIDE.md`
- Section: Troubleshooting → Issue 2

### JWT Token Invalid
- File: `SETUP_AND_TESTING_GUIDE.md`
- Section: Troubleshooting → Issue 3

### Build Fails
- Check: Java version (must be 21+)
- Check: Internet connection (for dependency download)
- Try: `mvn clean install -U` (force update)

### PostgreSQL Won't Start
- **Windows**: Check Services (services.msc)
- **Mac**: `brew services start postgresql`
- **Linux**: `sudo service postgresql start`

---

## 📞 Common Issues

### Issue: "Cannot connect to database"
```
Solution:
1. Check PostgreSQL is running
2. Verify credentials in application.properties
3. Try: psql -U postgres -d authservice_db
4. Check port 5432 is not blocked
```

### Issue: "Port 8080 in use"
```
Solution:
1. Find process: lsof -i :8080 (Mac/Linux)
                netstat -ano | findstr :8080 (Windows)
2. Kill process: kill -9 <PID>
3. Or change port in application.properties: server.port=8081
```

### Issue: "Dependencies not downloading"
```
Solution:
1. Check internet connection
2. Try: mvn clean install -U
3. Delete .m2 folder and retry
4. Check proxy settings
```

### Issue: "Java version error"
```
Solution:
1. Check: java -version
2. Must be Java 21 or higher
3. Update Java if needed
```

---

## 📝 Notes

- **Always** update database password in `application.properties` before first run
- **Never** commit `application.properties` with real credentials to git
- **In production**: Change `app.jwt.secret` to a strong random key
- **Keep backup** of database before testing destructive operations
- **Change permissions** on application.properties: `chmod 600` (Linux/Mac)

---

## ✨ You're All Set!

Once you've completed this checklist:

1. **Run**: `mvn spring-boot:run`
2. **Test**: Follow Postman tests in `SETUP_AND_TESTING_GUIDE.md`
3. **Learn**: Read code in this order:
   - `AuthController.java`
   - `AuthService.java`
   - `JwtUtil.java`
   - `SecurityConfig.java`
4. **Explore**: Try making small changes and observe effects

---

## 📚 Reference Files

- Database Setup: `SETUP_AND_TESTING_GUIDE.md`
- Quick Start: `README.md`
- Architecture: `ARCHITECTURE_DIAGRAMS.md`
- All Files: `FILE_INDEX.md`
- Project Summary: `PROJECT_SUMMARY.md`

---

## ⏱️ Estimated Timeline

- Setup & Dependencies: 5-10 minutes
- First Run: 2-3 minutes
- Database Verification: 2 minutes
- Postman Testing: 10-15 minutes
- Understanding Code: 2-3 hours

**Total for first-time setup: 30-45 minutes**

---

**Last Updated**: December 2024
**Project**: CineVerse Authentication Service
**Status**: Ready to Launch ✅

---

## 🎓 For Your Viva

Be ready to explain:
1. "What did you verify before launching?" → Show this checklist
2. "How did you configure the database?" → Show application.properties
3. "How do you know the app started correctly?" → Show startup logs
4. "What dependencies does your project need?" → Show pom.xml

Good luck! 🚀
