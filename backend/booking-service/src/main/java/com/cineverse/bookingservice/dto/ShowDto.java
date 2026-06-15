package com.cineverse.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShowDto {
    @NotBlank(message = "Movie ID is mandatory")
    private String movieId;

    @NotNull(message = "Screen ID is mandatory")
    private Long screenId;

    @NotBlank(message = "Show time is mandatory")
    private String showTime;
}
