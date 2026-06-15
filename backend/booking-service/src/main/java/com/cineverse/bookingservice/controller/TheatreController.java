package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.dto.TheatreDto;
import com.cineverse.bookingservice.entity.Theatre;
import com.cineverse.bookingservice.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theatres")
@RequiredArgsConstructor
public class TheatreController {

    private final TheatreService theatreService;

    @PostMapping
    public ResponseEntity<StandardResponse<Theatre>> createTheatre(@Valid @RequestBody TheatreDto dto) {
        Theatre theatre = theatreService.createTheatre(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Theatre created successfully", theatre));
    }

    @GetMapping
    public ResponseEntity<StandardResponse<List<Theatre>>> getAllTheatres() {
        return ResponseEntity.ok(StandardResponse.success("Theatres fetched successfully", theatreService.getAllTheatres()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse<Theatre>> getTheatreById(@PathVariable Long id) {
        return ResponseEntity.ok(StandardResponse.success("Theatre fetched successfully", theatreService.getTheatreById(id)));
    }
}
