package com.cineverse.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * GatewayApplication - Main entry point for the API Gateway
 * 
 * This is the Spring Boot application class that:
 * 1. Starts the gateway server on port 8080
 * 2. Loads configuration from application.properties
 * 3. Registers all routes defined in GatewayRouteConfig
 * 4. Applies JWT validation filter to protected routes
 * 5. Logs all incoming requests
 * 
 * To run:
 * mvn spring-boot:run
 * 
 * Gateway will be available at: http://localhost:8080
 * 
 * Example requests:
 * - Public: POST http://localhost:8080/auth/login
 * - Protected: GET http://localhost:8080/movies (requires JWT token)
 */
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        
        System.out.println("\n" +
                "╔════════════════════════════════════════╗\n" +
                "║  CineVerse API Gateway Started!        ║\n" +
                "║  Listening on: http://localhost:8080   ║\n" +
                "║  All routes are logged below.          ║\n" +
                "╚════════════════════════════════════════╝\n"
        );
        
        System.out.println("PUBLIC ROUTES (No JWT Required):");
        System.out.println("  POST   /auth/register");
        System.out.println("  POST   /auth/login\n");
        
        System.out.println("PROTECTED ROUTES (JWT Required):");
        System.out.println("  GET    /auth/protected/test");
        System.out.println("  GET    /auth/admin/test");
        System.out.println("  GET    /auth/user/test");
        System.out.println("  GET    /movies");
        System.out.println("  GET    /reviews\n");
    }
}
