package com.cineverse.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * AuthServiceApplication - Main entry point for the authentication microservice
 * 
 * @SpringBootApplication: Enables auto-configuration and component scanning
 * @EnableMethodSecurity: Enables @PreAuthorize annotations for method-level security
 */
@SpringBootApplication
@EnableMethodSecurity(prePostEnabled = true)  // Enable @PreAuthorize annotations
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

}
