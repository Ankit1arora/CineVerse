package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.ScreenDto;
import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.entity.Screen;
import com.cineverse.bookingservice.service.ScreenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/screens")
@RequiredArgsConstructor
public class ScreenController {

    private final ScreenService screenService;

    @PostMapping
    public ResponseEntity<StandardResponse<Screen>> createScreen(@Valid @RequestBody ScreenDto dto) {
        Screen screen = screenService.createScreen(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Screen created successfully", screen));
    }

    @GetMapping("/theatre/{theatreId}")
    public ResponseEntity<StandardResponse<List<Screen>>> getScreensByTheatre(@PathVariable Long theatreId) {
        return ResponseEntity.ok(StandardResponse.success("Screens fetched successfully", screenService.getScreensByTheatre(theatreId)));
    }
}
