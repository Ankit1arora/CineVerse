package com.cineverse.authservice.repository;

import com.cineverse.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Spring Data JPA repository for User entity
 * 
 * Extends JpaRepository<User, Long>:
 * - User: The entity type we're working with
 * - Long: The type of the primary key (ID)
 * 
 * JpaRepository provides built-in methods like:
 * - save(), findById(), findAll(), delete(), etc.
 * 
 * We can also define custom query methods.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find a user by email
     * 
     * Returns Optional because user might not exist
     * Optional prevents NullPointerException
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if a user with the given email exists
     */
    boolean existsByEmail(String email);
}
