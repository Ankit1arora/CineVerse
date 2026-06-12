package com.cineverse.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthResponse DTO - Represents the response sent to client after login/registration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;  // JWT token
    private String message;  // Response message
    private String role;  // User's role
}
