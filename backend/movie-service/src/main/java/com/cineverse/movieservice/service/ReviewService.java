package com.cineverse.movieservice.service;

import com.cineverse.movieservice.dto.ReviewDto;
import com.cineverse.movieservice.entity.Review;
import com.cineverse.movieservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class handling business logic for reviews.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review addReview(ReviewDto reviewDto) {
        Review review = new Review();
        review.setMovieId(reviewDto.getMovieId());
        review.setUserName(reviewDto.getUserName());
        review.setRating(reviewDto.getRating());
        review.setReview(reviewDto.getReview());
        
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByMovie(String movieId) {
        return reviewRepository.findByMovieId(movieId);
    }
}
