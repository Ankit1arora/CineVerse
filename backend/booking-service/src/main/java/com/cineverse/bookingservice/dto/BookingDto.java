package com.cineverse.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDto {
    @NotBlank(message = "User Name is mandatory")
    private String userName;

    @NotNull(message = "Show ID is mandatory")
    private Long showId;

    @NotBlank(message = "Seat Number is mandatory")
    private String seatNumber;
}
