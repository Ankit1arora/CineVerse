package com.cineverse.gateway.filter;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * LoggingFilter - Global Filter for logging all requests
 * 
 * This filter runs for every request entering the gateway.
 * It prints:
 * - HTTP Method (GET, POST, etc.)
 * - Request Path (/auth/login, /movies, etc.)
 * - Query Parameters
 * 
 * This is useful for:
 * - Debugging
 * - Monitoring traffic
 * - Understanding request flow
 */
@Configuration
public class LoggingFilter {
    
    /**
     * Create a GlobalFilter bean for logging
     * 
     * GlobalFilter runs for all requests (no route matching)
     */
    @Bean
    public GlobalFilter logRequestAndResponse() {
        return (exchange, chain) -> {
            // Get request information
            ServerWebExchange webExchange = exchange;
            
            // Extract HTTP method and path
            String method = webExchange.getRequest().getMethod().toString();
            String path = webExchange.getRequest().getPath().value();
            String query = webExchange.getRequest().getQueryParams().toString();
            
            // Print incoming request information
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║ INCOMING REQUEST                       ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║ Method: " + padRight(method, 30) + "║");
            System.out.println("║ Path:   " + padRight(path, 30) + "║");
            if (!query.isEmpty()) {
                System.out.println("║ Query:  " + padRight(query.substring(0, Math.min(query.length(), 30)), 30) + "║");
            }
            System.out.println("╚════════════════════════════════════════╝");
            
            // Continue to next filter in chain
            return chain.filter(exchange);
        };
    }
    
    /**
     * Helper method to pad strings for nice formatting
     */
    private static String padRight(String s, int length) {
        return String.format("%-" + length + "s", s);
    }
}
