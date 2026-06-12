package com.cineverse.authservice.service;

import com.cineverse.authservice.dto.AuthResponse;
import com.cineverse.authservice.dto.LoginRequest;
import com.cineverse.authservice.dto.RegisterRequest;
import com.cineverse.authservice.entity.User;
import com.cineverse.authservice.entity.UserRole;
import com.cineverse.authservice.repository.UserRepository;
import com.cineverse.authservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - Handles authentication business logic
 * 
 * Responsibilities:
 * 1. Register new users
 * 2. Login users
 * 3. Validate credentials
 * 4. Generate JWT tokens
 */
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Register a new user
     * 
     * @param registerRequest: Contains name, email, password, role
     * @return: AuthResponse with message and token
     * @throws: RuntimeException if email already exists
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        
        // Determine user role (default to USER if not specified)
        UserRole role = UserRole.USER;
        if (registerRequest.getRole() != null && 
            registerRequest.getRole().equalsIgnoreCase("ADMIN")) {
            role = UserRole.ADMIN;
        }
        
        // Create new user object
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        // Encode password using BCrypt before saving
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(role);
        
        // Save user to database
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().toString());
        
        // Return response
        return new AuthResponse(
                token,
                "User registered successfully!",
                savedUser.getRole().toString()
        );
    }
    
    /**
     * Login user with email and password
     * 
     * @param loginRequest: Contains email and password
     * @return: AuthResponse with JWT token
     * @throws: RuntimeException if credentials are invalid
     */
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        
        // Check if password matches (encoded password in DB with provided password)
        // passwordEncoder.matches() compares raw password with BCrypt hash
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        
        // Return response
        return new AuthResponse(
                token,
                "Login successful!",
                user.getRole().toString()
        );
    }
}
