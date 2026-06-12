package com.cineverse.authservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JwtUtil - Utility class for JWT token operations
 * 
 * Responsibilities:
 * 1. Generate JWT tokens
 * 2. Validate JWT tokens
 * 3. Extract email and role from tokens
 * 4. Check token expiration
 */
@Component
public class JwtUtil {
    
    // Secret key for signing tokens (injected from application.properties)
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    // Token expiration time (injected from application.properties)
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;
    
    /**
     * Generate JWT token
     * 
     * @param email: User's email (used as unique identifier)
     * @param role: User's role (USER or ADMIN)
     * @return: Generated JWT token
     */
    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        // Create a SecretKey from the secret string
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        // Build and sign the JWT
        return Jwts.builder()
                .subject(email)  // Subject = email
                .claim("role", role)  // Add role as a claim
                .issuedAt(now)  // When token was created
                .expiration(expiryDate)  // When token expires
                .signWith(key, SignatureAlgorithm.HS256)  // Sign with secret key
                .compact();  // Convert to string
    }
    
    /**
     * Get all claims from JWT token
     * 
     * @param token: JWT token string
     * @return: Claims object containing email, role, expiration, etc.
     */
    private Claims getClaimsFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Extract email from JWT token
     * 
     * @param token: JWT token string
     * @return: Email stored in token's subject
     */
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }
    
    /**
     * Extract role from JWT token
     * 
     * @param token: JWT token string
     * @return: Role stored in token's claims
     */
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }
    
    /**
     * Check if JWT token is expired
     * 
     * @param token: JWT token string
     * @return: true if token is expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaimsFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;  // If parsing fails, consider token as expired
        }
    }
    
    /**
     * Validate JWT token
     * 
     * This checks:
     * 1. Token signature is valid
     * 2. Token is not expired
     * 3. Email can be extracted
     * 
     * @param token: JWT token string
     * @return: true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            
            // If parsing succeeds and token is not expired, it's valid
            return !isTokenExpired(token);
        } catch (Exception e) {
            // If any exception occurs during parsing, token is invalid
            System.out.println("Invalid token: " + e.getMessage());
            return false;
        }
    }
}
