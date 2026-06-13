package com.cineverse.movieservice.exception;

/**
 * Custom exception thrown when a requested movie cannot be found in the database.
 */
public class MovieNotFoundException extends RuntimeException {
    
    public MovieNotFoundException(String message) {
        super(message);
    }
}
