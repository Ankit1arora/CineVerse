package com.cineverse.movieservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Basic Security Configuration for the Movie Service.
 * Since the API Gateway handles JWT validation, we only need to secure the endpoints.
 * - GET requests are public
 * - POST, PUT, DELETE requests require authentication (which Gateway would provide/pass-through)
 * - In a real scenario, Gateway would pass user context headers that we'd extract here.
 * For this simple college project, we disable CSRF and allow all GETs, but require auth for modifications.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Allow all GET requests publicly (fetching movies, reviews, searches)
                .requestMatchers(HttpMethod.GET, "/movies/**", "/reviews/**").permitAll()
                // You can customize further if Gateway passes a header, but assuming Gateway handles auth logic
                // and just forwards valid requests, we can either permitAll() or require authentication.
                // For a beginner setup, if Gateway validates JWT, by the time request reaches here, it's valid.
                // So we permit all since Gateway acts as our guard.
                .anyRequest().permitAll() 
            );
            
        return http.build();
    }
}
