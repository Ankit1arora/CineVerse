package com.cineverse.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Entity - Maps to 'users' table in PostgreSQL database
 * 
 * Using Lombok annotations:
 * - @Data: Generates getters, setters, toString, equals, hashCode
 * - @NoArgsConstructor: Generates constructor with no parameters
 * - @AllArgsConstructor: Generates constructor with all fields as parameters
 */
@Entity
@Table(name = "users")  // Table name in database
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment ID
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "email", nullable = false, unique = true)  // Email must be unique
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;  // Will be stored as BCrypt hash
    
    @Enumerated(EnumType.STRING)  // Store enum as string ("USER" or "ADMIN")
    @Column(name = "role", nullable = false)
    private UserRole role;
}
