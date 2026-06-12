package com.cineverse.authservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * JwtAuthenticationFilter - Processes JWT tokens from incoming requests
 * 
 * This filter runs ONCE per request (OncePerRequestFilter)
 * 
 * Flow:
 * 1. Extract JWT token from Authorization header
 * 2. Validate the token
 * 3. Extract email and role from token
 * 4. Create authentication object and set it in SecurityContext
 * 5. Request proceeds with authentication
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        try {
            // Get Authorization header (format: "Bearer <token>")
            String authHeader = request.getHeader("Authorization");
            
            // Check if header exists and starts with "Bearer "
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                
                // Extract token by removing "Bearer " prefix
                String token = authHeader.substring(7);
                
                // Validate the token
                if (jwtUtil.validateToken(token)) {
                    
                    // Extract email and role from token
                    String email = jwtUtil.getEmailFromToken(token);
                    String role = jwtUtil.getRoleFromToken(token);
                    
                    // Create a list of authorities (roles) for this user
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    
                    // Create authentication token
                    // First parameter: principal (user identifier)
                    // Second parameter: credentials (null since token is already validated)
                    // Third parameter: authorities (roles)
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    
                    // Set authentication in SecurityContext
                    // This makes the user authenticated for this request
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // If any error occurs, log it and continue
            System.out.println("Cannot set user authentication: " + e.getMessage());
        }
        
        // Continue with the next filter
        filterChain.doFilter(request, response);
    }
}
