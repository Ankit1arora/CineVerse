package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.entity.Seat;
import com.cineverse.bookingservice.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/{showId}")
    public ResponseEntity<StandardResponse<List<Seat>>> getSeatsForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(StandardResponse.success("Seats fetched successfully", seatService.getSeatsByShow(showId)));
    }
}
