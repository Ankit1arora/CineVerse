package com.cineverse.movieservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating and updating movies.
 * Contains validation rules to ensure data integrity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    @NotBlank(message = "Genre is mandatory")
    private String genre;

    private String language;
    private Integer duration;
    private String releaseDate;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 0, message = "Rating must be at least 0")
    @Max(value = 10, message = "Rating must be at most 10")
    private Double rating;

    private String posterUrl;
}
