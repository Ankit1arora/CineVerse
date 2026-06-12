package com.cineverse.gateway.config;

import com.cineverse.gateway.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * GatewayRouteConfig - Configuration for all API Gateway routes
 * 
 * This configuration defines:
 * 1. Which requests route to which backend services
 * 2. Which routes require JWT validation
 * 3. Which routes are public (no JWT required)
 * 
 * Route Flow:
 * Public Routes (No JWT):
 * - /auth/register → Auth Service
 * - /auth/login → Auth Service
 * 
 * Protected Routes (JWT Required):
 * - /auth/** → Auth Service (except register/login)
 * - /movies/** → Movie Service
 * - /reviews/** → Review Service
 */
@Configuration
public class GatewayRouteConfig {
    
    // Inject service URLs from application.properties
    @Value("${auth.service.url}")
    private String authServiceUrl;
    
    @Value("${movie.service.url}")
    private String movieServiceUrl;
    
    @Value("${review.service.url}")
    private String reviewServiceUrl;
    
    // Inject JWT filter
    @Autowired
    private JwtFilter jwtFilter;
    
    /**
     * Define all gateway routes
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                
                // ==================== PUBLIC ROUTES (No JWT Required) ====================
                
                /*
                 * Route 1: Auth Register Endpoint
                 * /auth/register → Auth Service
                 * No JWT validation (public endpoint for user registration)
                 */
                .route("auth-register", r -> r
                        .path("/auth/register")
                        .uri(authServiceUrl)
                )
                
                /*
                 * Route 2: Auth Login Endpoint
                 * /auth/login → Auth Service
                 * No JWT validation (public endpoint for user login)
                 */
                .route("auth-login", r -> r
                        .path("/auth/login")
                        .uri(authServiceUrl)
                )
                
                // ==================== PROTECTED ROUTES (JWT Required) ====================
                
                /*
                 * Route 3: Auth Protected Endpoints
                 * /auth/** (except register/login) → Auth Service
                 * JWT validation required before forwarding
                 */
                .route("auth-protected", r -> r
                        .path("/auth/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtFilter.Config())))
                        .uri(authServiceUrl)
                )
                
                /*
                 * Route 4: Movie Service Routes
                 * /movies/** → Movie Service
                 * JWT validation required before forwarding
                 * Examples:
                 * - GET /movies → List all movies
                 * - POST /movies → Add new movie (admin only)
                 * - GET /movies/{id} → Get movie details
                 */
                .route("movie-service", r -> r
                        .path("/movies/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtFilter.Config())))
                        .uri(movieServiceUrl)
                )
                
                /*
                 * Route 5: Review Service Routes
                 * /reviews/** → Review Service
                 * JWT validation required before forwarding
                 * Examples:
                 * - GET /reviews → List all reviews
                 * - POST /reviews → Add new review
                 * - GET /reviews/{id} → Get review details
                 */
                .route("review-service", r -> r
                        .path("/reviews/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtFilter.Config())))
                        .uri(reviewServiceUrl)
                )
                
                .build();
    }
    
    /*
     * ROUTE SUMMARY:
     * 
     * Public Routes (accessible without login):
     * └─ POST /auth/register - Register new user
     * └─ POST /auth/login - Login user and get JWT token
     * 
     * Protected Routes (require JWT token):
     * ├─ /auth/**
     * │  ├─ GET /auth/protected/test - Test protected endpoint
     * │  ├─ GET /auth/admin/test - Admin only
     * │  └─ GET /auth/user/test - User role
     * │
     * ├─ /movies/**
     * │  ├─ GET /movies - List all movies
     * │  ├─ GET /movies/{id} - Get movie details
     * │  ├─ POST /movies - Add new movie (admin)
     * │  ├─ PUT /movies/{id} - Update movie (admin)
     * │  └─ DELETE /movies/{id} - Delete movie (admin)
     * │
     * └─ /reviews/**
     *    ├─ GET /reviews - List all reviews
     *    ├─ GET /reviews/{id} - Get review details
     *    ├─ POST /reviews - Add new review
     *    ├─ PUT /reviews/{id} - Update review
     *    └─ DELETE /reviews/{id} - Delete review
     */
}
