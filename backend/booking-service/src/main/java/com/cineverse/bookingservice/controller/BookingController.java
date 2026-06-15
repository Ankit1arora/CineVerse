package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.BookingDto;
import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.entity.Booking;
import com.cineverse.bookingservice.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<StandardResponse<Booking>> createBooking(@Valid @RequestBody BookingDto dto) {
        Booking booking = bookingService.createBooking(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Booking confirmed", booking));
    }
}
