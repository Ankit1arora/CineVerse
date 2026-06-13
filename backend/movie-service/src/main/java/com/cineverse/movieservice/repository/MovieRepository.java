package com.cineverse.movieservice.repository;

import com.cineverse.movieservice.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Movie entity operations.
 * Extends MongoRepository to inherit common CRUD and pagination methods.
 */
@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    
    // Custom query method to find movies containing the given title (case-insensitive)
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    // Custom query method to find movies by genre
    List<Movie> findByGenre(String genre);
    
    // Custom query method to find movies with rating greater than or equal to the given value
    List<Movie> findByRatingGreaterThanEqual(Double rating);
}
