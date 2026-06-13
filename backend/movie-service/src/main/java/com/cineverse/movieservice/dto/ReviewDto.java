package com.cineverse.movieservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating reviews.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    @NotBlank(message = "Movie ID is mandatory")
    private String movieId;

    @NotBlank(message = "User Name is mandatory")
    private String userName;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotBlank(message = "Review content is mandatory")
    private String review;
}
