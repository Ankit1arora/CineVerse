package com.cineverse.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TheatreDto {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Location is mandatory")
    private String location;
}
