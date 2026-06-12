package com.cineverse.authservice.entity;

/**
 * UserRole Enum - Defines all possible roles in the system
 * 
 * This enum restricts role values to only 'USER' and 'ADMIN'.
 * Using an enum prevents invalid role assignments.
 */
public enum UserRole {
    USER,      // Regular user role
    ADMIN      // Administrator role (has more permissions)
}
