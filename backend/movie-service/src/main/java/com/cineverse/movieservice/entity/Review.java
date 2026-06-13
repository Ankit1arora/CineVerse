package com.cineverse.movieservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Review Entity representing a document in the MongoDB "reviews" collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {
    
    @Id
    private String id;
    
    private String movieId; // Link to the Movie entity
    private String userName;
    private Integer rating;
    private String review;
}
