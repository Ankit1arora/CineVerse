package com.cineverse.authservice.config;

import com.cineverse.authservice.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig - Configures Spring Security for the application
 * 
 * Responsibilities:
 * 1. Define which endpoints require authentication
 * 2. Set up password encoding (BCrypt)
 * 3. Register JWT filter
 * 4. Configure session management
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * PasswordEncoder Bean - Uses BCrypt algorithm to encode passwords
     * 
     * BCrypt is one-way hashing, making it secure for storing passwords
     * 
     * @return: BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * SecurityFilterChain Bean - Main security configuration
     * 
     * @param http: HttpSecurity object to configure security
     * @return: SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (safe for stateless JWT-based APIs)
                .csrf(csrf -> csrf.disable())
                
                // Configure authorization for endpoints
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no authentication required)
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        
                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // User-only endpoints
                        .requestMatchers("/api/user/**").hasRole("USER")
                        
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                
                // Use stateless session (no cookies, only JWT tokens)
                // This is important for REST APIs
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        new JwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );
        
        return http.build();
    }
}
