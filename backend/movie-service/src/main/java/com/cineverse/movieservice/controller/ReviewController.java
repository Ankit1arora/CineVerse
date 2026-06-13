package com.cineverse.movieservice.controller;

import com.cineverse.movieservice.dto.ReviewDto;
import com.cineverse.movieservice.dto.StandardResponse;
import com.cineverse.movieservice.entity.Review;
import com.cineverse.movieservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Review operations.
 */
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<StandardResponse<Review>> addReview(@Valid @RequestBody ReviewDto reviewDto) {
        Review review = reviewService.addReview(reviewDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Review added successfully", review));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<StandardResponse<List<Review>>> getReviewsByMovie(@PathVariable String movieId) {
        List<Review> reviews = reviewService.getReviewsByMovie(movieId);
        return ResponseEntity.ok(StandardResponse.success("Reviews fetched successfully", reviews));
    }
}
