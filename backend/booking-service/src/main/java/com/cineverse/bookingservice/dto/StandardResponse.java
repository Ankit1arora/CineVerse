package com.cineverse.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandardResponse<T> {
    
    private String status;
    private String message;
    private T data;
    
    public static <T> StandardResponse<T> success(String message, T data) {
        return new StandardResponse<>("success", message, data);
    }
    
    public static <T> StandardResponse<T> error(String message) {
        return new StandardResponse<>("error", message, null);
    }
}
