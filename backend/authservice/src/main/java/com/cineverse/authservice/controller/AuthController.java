package com.cineverse.authservice.controller;

import com.cineverse.authservice.dto.AuthResponse;
import com.cineverse.authservice.dto.LoginRequest;
import com.cineverse.authservice.dto.RegisterRequest;
import com.cineverse.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - REST API endpoints for authentication
 * 
 * Base URL: http://localhost:8080/auth
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")  // Allow requests from any origin (frontend)
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * POST /auth/register
     * 
     * Register a new user
     * 
     * Request body:
     * {
     *   "name": "Ankit",
     *   "email": "ankit@gmail.com",
     *   "password": "123456",
     *   "role": "USER"
     * }
     * 
     * @param registerRequest: User registration details
     * @return: AuthResponse with JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            // Return error response if registration fails
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, e.getMessage(), null));
        }
    }
    
    /**
     * POST /auth/login
     * 
     * Login user and receive JWT token
     * 
     * Request body:
     * {
     *   "email": "ankit@gmail.com",
     *   "password": "123456"
     * }
     * 
     * @param loginRequest: User login credentials
     * @return: AuthResponse with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Return error response if login fails
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, e.getMessage(), null));
        }
    }
    
    // ==================== Sample Protected Endpoints ====================
    // These are demonstration endpoints to test JWT authentication
    
    /**
     * GET /auth/public/test
     * 
     * Public endpoint - No authentication required
     * This endpoint is accessible by anyone without JWT token
     */
    @GetMapping("/public/test")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("This is a public endpoint - No authentication required!");
    }
    
    /**
     * GET /auth/protected/test
     * 
     * Protected endpoint - JWT authentication required
     * Returns the email of authenticated user
     */
    @GetMapping("/protected/test")
    public ResponseEntity<String> protectedEndpoint() {
        // Get authenticated user's email from SecurityContext
        String userEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        return ResponseEntity.ok("Protected endpoint accessed by: " + userEmail);
    }
    
    /**
     * GET /auth/admin/test
     * 
     * Admin-only endpoint - Only users with ADMIN role can access
     * 
     * @PreAuthorize("hasRole('ADMIN')") - Checks if user has ADMIN role
     * If not, returns 403 Forbidden
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/test")
    public ResponseEntity<String> adminOnlyEndpoint() {
        return ResponseEntity.ok("This is an admin-only endpoint!");
    }
    
    /**
     * GET /auth/user/test
     * 
     * User-only endpoint - Only users with USER role can access
     * 
     * @PreAuthorize("hasRole('USER')") - Checks if user has USER role
     * If not, returns 403 Forbidden
     */
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/test")
    public ResponseEntity<String> userOnlyEndpoint() {
        return ResponseEntity.ok("This is a user-only endpoint!");
    }
}
