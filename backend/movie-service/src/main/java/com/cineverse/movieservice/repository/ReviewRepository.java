package com.cineverse.movieservice.repository;

import com.cineverse.movieservice.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Review entity operations.
 */
@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    // Custom query method to fetch all reviews for a specific movie ID
    List<Review> findByMovieId(String movieId);
}
