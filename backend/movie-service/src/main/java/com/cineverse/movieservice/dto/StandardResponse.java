package com.cineverse.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A standard, uniform response format for all API endpoints.
 * @param <T> The type of the data payload
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandardResponse<T> {
    
    private String status;
    private String message;
    private T data;
    
    // Convenience methods to create responses easily
    public static <T> StandardResponse<T> success(String message, T data) {
        return new StandardResponse<>("success", message, data);
    }
    
    public static <T> StandardResponse<T> error(String message) {
        return new StandardResponse<>("error", message, null);
    }
}
