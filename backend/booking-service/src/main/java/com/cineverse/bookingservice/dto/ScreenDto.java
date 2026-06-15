package com.cineverse.bookingservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScreenDto {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Capacity is mandatory")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Theatre ID is mandatory")
    private Long theatreId;
}
