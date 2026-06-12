package com.cineverse.gateway.filter;

import com.cineverse.gateway.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * JwtFilter - Custom Gateway Filter for JWT validation
 * 
 * This filter:
 * 1. Extracts JWT token from Authorization header
 * 2. Validates the token
 * 3. Forwards request if valid
 * 4. Rejects with 401 if invalid
 * 
 * Applied to protected routes only (not applied to /auth/register, /auth/login)
 */
@Component
public class JwtFilter extends AbstractGatewayFilterFactory<JwtFilter.Config> {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Configuration class for the filter (not used in this simple version)
    public static class Config {
    }
    
    public JwtFilter() {
        super(Config.class);
    }
    
    /**
     * Apply filter to the request
     * 
     * This method is called for every request matching this filter
     */
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            try {
                // Step 1: Extract Authorization header
                // Format: "Authorization: Bearer <token>"
                String authHeader = exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);
                
                // If Authorization header is missing
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    // Set response status to 401 Unauthorized
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
                
                // Step 2: Extract token by removing "Bearer " prefix
                String token = authHeader.substring(7);
                
                // Step 3: Validate token
                if (!jwtUtil.validateToken(token)) {
                    // Token is invalid
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
                
                // Step 4: Token is valid, extract user info
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                
                // Log successful validation
                System.out.println("✓ JWT Valid - User: " + email + " | Role: " + role);
                
            } catch (Exception e) {
                // If any exception occurs during token validation
                System.out.println("✗ JWT Validation Error: " + e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            
            // If all validations pass, continue to next filter/service
            return chain.filter(exchange);
        };
    }
}
