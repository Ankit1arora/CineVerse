# API Gateway - Pre-Launch Checklist

Before starting the gateway, verify all prerequisites are met. This checklist ensures a smooth setup experience.

---

## ✅ Phase 1: Environment Setup

### 1.1: Java Installation
```bash
java -version
```
Expected output:
```
java version "21" or higher
```
**Status:** ☐ Pass ☐ Fail

**Fix if needed:**
- Download Java 21 from [oracle.com](https://www.oracle.com/java/technologies/downloads/) or [openjdk.org](https://openjdk.org/)
- Add JAVA_HOME to system PATH

---

### 1.2: Maven Installation
```bash
mvn -version
```
Expected output:
```
Apache Maven 3.8.0 or higher
```
**Status:** ☐ Pass ☐ Fail

**Fix if needed:**
- Download Maven from [maven.apache.org](https://maven.apache.org/download.cgi)
- Add MAVEN_HOME to system PATH

---

### 1.3: Git (Optional but recommended)
```bash
git --version
```
**Status:** ☐ Pass ☐ Fail (OK to skip)

---

## ✅ Phase 2: Project Structure

### 2.1: Gateway Directory Exists
Navigate to workspace:
```bash
cd backend/gateway
```
Expected: Directory exists without errors

**Status:** ☐ Pass ☐ Fail

---

### 2.2: All Gateway Files Present
Verify these files exist:
```
gateway/
├── pom.xml                                    ☐
├── README.md                                  ☐
├── GATEWAY_SETUP_AND_TESTING_GUIDE.md         ☐
├── PRE_LAUNCH_CHECKLIST.md                    ☐
└── src/main/
    ├── java/com/cineverse/gateway/
    │   ├── GatewayApplication.java            ☐
    │   ├── config/
    │   │   └── GatewayRouteConfig.java        ☐
    │   ├── filter/
    │   │   ├── JwtFilter.java                 ☐
    │   │   └── LoggingFilter.java             ☐
    │   └── security/
    │       └── JwtUtil.java                   ☐
    └── resources/
        └── application.properties             ☐
```

**Status:** ☐ All Present ☐ Missing Files

**Fix if needed:**
- Re-run creation script to generate missing files

---

## ✅ Phase 3: Configuration Verification

### 3.1: Check application.properties
```bash
cat src/main/resources/application.properties
```

Verify these settings exist:
```properties
server.port=8080                           ☐
auth.service.url=http://localhost:8081     ☐
movie.service.url=http://localhost:8082    ☐
review.service.url=http://localhost:8083   ☐
app.jwt.secret=...                         ☐
```

**Status:** ☐ Pass ☐ Fail

**Fix if needed:**
- Update any missing or incorrect values
- Ensure JWT secret matches auth service secret

---

### 3.2: Check pom.xml Dependencies
```bash
grep -E "spring-cloud-gateway|jjwt|spring-boot-starter-security" pom.xml
```

Expected: All three dependencies present

Key dependencies to verify:
- ☐ spring-cloud-starter-gateway
- ☐ spring-boot-starter-security
- ☐ jjwt (version 0.12.3)
- ☐ lombok

**Status:** ☐ Pass ☐ Fail

---

## ✅ Phase 4: Dependency Check (Offline Dependencies)

### 4.1: Clear Old Maven Cache (If needed)
```bash
# Optional: Clear Maven cache to get fresh dependencies
# Windows:
rmdir /s /q %USERPROFILE%\.m2\repository

# Linux/Mac:
rm -rf ~/.m2/repository
```

**Status:** ☐ Skipped ☐ Completed

---

### 4.2: Download Dependencies
```bash
cd backend/gateway
mvn dependency:resolve
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Downloaded X artifacts
```

**Status:** ☐ Pass ☐ Fail

**If failed:**
- Check internet connection
- Verify Maven settings: `mvn -X dependency:resolve`
- Check proxy settings if behind corporate firewall

---

## ✅ Phase 5: Build Verification

### 5.1: Clean Build
```bash
mvn clean
```

Expected output:
```
[INFO] Deleting ...
[INFO] BUILD SUCCESS
```

**Status:** ☐ Pass ☐ Fail

---

### 5.2: Compile Code
```bash
mvn compile
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXs
```

**Status:** ☐ Pass ☐ Fail

**If failed:**
- Check Java compiler errors: `mvn clean compile -X`
- Verify all files created correctly
- Check JDK version (must be 21+)

---

### 5.3: Full Build
```bash
mvn clean install
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Tests run: X
[INFO] BUILD SUCCESS
```

**Status:** ☐ Pass ☐ Fail

**If failed:**
- Review error messages
- Check GATEWAY_SETUP_AND_TESTING_GUIDE.md troubleshooting section
- Verify dependencies downloaded correctly

---

## ✅ Phase 6: Auth Service Dependency

### 6.1: Auth Service Running?
In a separate terminal, verify auth service is running:
```bash
curl http://localhost:8081/auth/public/test
```

Expected response:
```
✓ Public endpoint works!
```

**Status:** ☐ Running ☐ Not Running

**If not running:**
```bash
cd backend/authservice
mvn spring-boot:run
```

Wait 30 seconds for startup...

---

## ✅ Phase 7: Gateway Startup Test

### 7.1: Start Gateway
```bash
mvn spring-boot:run
```

Expected output (should contain):
```
╔════════════════════════════════════════╗
║  CineVerse API Gateway Started!        ║
║  Listening on: http://localhost:8080   ║
╚════════════════════════════════════════╝
```

Wait for:
```
Started GatewayApplication in X.XXX seconds
```

**Status:** ☐ Started Successfully ☐ Failed to Start

**If failed:**
- Check console for error messages
- Verify port 8080 is not in use
- Review logs in IDE console
- See troubleshooting section below

---

### 7.2: Verify Gateway is Responding
In another terminal (while gateway is running):
```bash
curl http://localhost:8080/auth/public/test
```

Expected response:
```
✓ Public endpoint works!
```

**Status:** ☐ Responding ☐ Not Responding

**If not responding:**
- Wait 10 more seconds for full startup
- Check firewall settings
- Verify gateway didn't crash (check console)

---

## ✅ Phase 8: JWT Token Flow Test

### 8.1: Register New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123",
    "role": "USER"
  }'
```

Expected response (should contain):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Status:** ☐ Pass ☐ Fail

**Save the token for next test.**

---

### 8.2: Access Protected Route with Token
Use token from previous step:
```bash
curl http://localhost:8080/auth/protected/test \
  -H "Authorization: Bearer <paste_token_here>"
```

Expected response:
```
✓ Protected endpoint works! User: test@test.com
```

**Status:** ☐ Pass ☐ Fail

**If failed:**
- Verify token was copied correctly
- Check "Bearer" prefix is included
- Ensure JWT secrets match

---

### 8.3: Try Protected Route WITHOUT Token
```bash
curl http://localhost:8080/auth/protected/test
```

Expected response:
```
HTTP/1.1 401 Unauthorized
```

**Status:** ☐ Pass (correctly rejected) ☐ Fail

---

## ✅ Phase 9: Gateway Console Logs

### 9.1: Check Request Logging
When you made requests in Phase 8, check gateway console for logs like:

```
╔════════════════════════════════════════╗
║ INCOMING REQUEST                       ║
╠════════════════════════════════════════╣
║ Method: POST                           ║
║ Path:   /auth/register                 ║
╚════════════════════════════════════════╝
```

**Status:** ☐ Logs Visible ☐ No Logs

**If no logs:**
- Check `logging.level.root=INFO` in application.properties
- Restart gateway
- Verify requests actually reached gateway

---

### 9.2: Check JWT Validation Logging
Look for logs like:
```
✓ JWT Valid - User: test@test.com | Role: USER
```

**Status:** ☐ Logs Visible ☐ No Logs

---

## ✅ Phase 10: Documentation Check

### 10.1: README.md Present and Complete
- ☐ README.md exists
- ☐ Contains quick start instructions
- ☐ Contains route summary table
- ☐ Contains file structure
- ☐ Contains testing examples

**Status:** ☐ Pass ☐ Fail

---

### 10.2: Testing Guide Present and Complete
- ☐ GATEWAY_SETUP_AND_TESTING_GUIDE.md exists
- ☐ Contains architecture diagram
- ☐ Contains setup steps
- ☐ Contains 9+ test examples with expected responses
- ☐ Contains Postman setup instructions
- ☐ Contains troubleshooting section

**Status:** ☐ Pass ☐ Fail

---

## ⚠️ Troubleshooting

### Issue: Port 8080 Already in Use
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Linux/Mac - Find and kill process
lsof -i :8080
kill -9 <pid>
```

---

### Issue: Build Fails with Compilation Errors
**Solution:**
```bash
# Check if all files were created
ls -la src/main/java/com/cineverse/gateway/

# Try clean rebuild
mvn clean install -X

# Check Java version
java -version
```

---

### Issue: Gateway Starts but JWT Validation Fails
**Solution:**
1. Verify JWT secrets match:
   - Gateway: `app.jwt.secret` in application.properties
   - Auth Service: `app.jwt.secret` in application.properties
2. Restart both services
3. Test with fresh token

---

### Issue: Can't Connect to Auth Service
**Solution:**
```bash
# Verify auth service is running
curl http://localhost:8081/auth/public/test

# If not running, start it
cd ../authservice
mvn spring-boot:run
```

---

### Issue: Requests Not Getting Logged
**Solution:**
1. Check logging configuration in application.properties
2. Ensure logging.level settings are present
3. Restart gateway after changing configuration

---

## 🎯 Final Checklist

Before declaring gateway ready, ensure:

- ☐ All files created successfully
- ☐ Maven build passes (mvn clean install)
- ☐ Gateway starts without errors
- ☐ Public endpoint returns 200 OK
- ☐ User registration successful
- ☐ Login returns JWT token
- ☐ Protected endpoint with valid token works
- ☐ Protected endpoint without token returns 401
- ☐ Console logs are visible
- ☐ Request logging shows method and path
- ☐ JWT validation logs show user and role

---

## ✅ Status Summary

| Phase | Task | Status |
|-------|------|--------|
| 1 | Environment Setup | ☐ Pass |
| 2 | Project Structure | ☐ Pass |
| 3 | Configuration | ☐ Pass |
| 4 | Dependency Check | ☐ Pass |
| 5 | Build Verification | ☐ Pass |
| 6 | Auth Service Dependency | ☐ Pass |
| 7 | Gateway Startup | ☐ Pass |
| 8 | JWT Token Flow | ☐ Pass |
| 9 | Logs Verification | ☐ Pass |
| 10 | Documentation | ☐ Pass |

---

## ✨ Success!

If all phases pass, your gateway is ready to use!

**Next Steps:**
1. Start testing with Postman (see GATEWAY_SETUP_AND_TESTING_GUIDE.md)
2. Create Movie Service
3. Create Review Service
4. Update frontend to use gateway

---

**Need Help?** 
- See README.md for quick reference
- See GATEWAY_SETUP_AND_TESTING_GUIDE.md for detailed guide
- Check troubleshooting section above
