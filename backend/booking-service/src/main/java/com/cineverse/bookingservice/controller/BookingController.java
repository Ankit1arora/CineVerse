package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.BookingDto;
import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.entity.Booking;
import com.cineverse.bookingservice.service.BookingService;
import com.cineverse.bookingservice.service.SeatLockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final SeatLockService seatLockService;

    // Main booking endpoint — uses Redis lock internally
    @PostMapping
    public ResponseEntity<StandardResponse<Booking>> createBooking(@Valid @RequestBody BookingDto dto) {
        Booking booking = bookingService.createBooking(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Booking confirmed", booking));
    }

    // --- Testing endpoints for Redis seat locking ---

    // Manually lock a seat in Redis (for testing only)
    @PostMapping("/lock")
    public ResponseEntity<StandardResponse<String>> lockSeat(
            @RequestParam Long showId,
            @RequestParam String seatNumber) {
        boolean success = seatLockService.lockSeat(showId, seatNumber);
        if (success) {
            return ResponseEntity.ok(StandardResponse.success("Seat locked successfully", "seat:" + showId + ":" + seatNumber));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(StandardResponse.error("Seat " + seatNumber + " is already locked"));
        }
    }

    // Manually release a seat lock (for testing only)
    @PostMapping("/release")
    public ResponseEntity<StandardResponse<String>> releaseSeat(
            @RequestParam Long showId,
            @RequestParam String seatNumber) {
        seatLockService.releaseSeat(showId, seatNumber);
        return ResponseEntity.ok(StandardResponse.success("Seat lock released", "seat:" + showId + ":" + seatNumber));
    }
}
