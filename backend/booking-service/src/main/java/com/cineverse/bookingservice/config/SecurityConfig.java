package com.cineverse.bookingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Allow GETs (theatres, screens, shows, seats)
                .requestMatchers(HttpMethod.GET, "/**").permitAll()
                // Require auth for others (POST, PUT, DELETE) 
                // Note: Gateway handles actual JWT parsing. We just rely on simple auth checks.
                .anyRequest().permitAll() // Allowing all for simplicity in this college project since Gateway protects the backend
            );
            
        return http.build();
    }
}
