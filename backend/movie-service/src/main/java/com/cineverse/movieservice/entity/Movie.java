package com.cineverse.movieservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Movie Entity representing a document in the MongoDB "movies" collection.
 * Uses Lombok @Data to automatically generate getters, setters, toString, etc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "movies")
public class Movie {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer duration; // Duration in minutes
    private String releaseDate; // Format: YYYY-MM-DD
    private Double rating;
    private String posterUrl;
}
