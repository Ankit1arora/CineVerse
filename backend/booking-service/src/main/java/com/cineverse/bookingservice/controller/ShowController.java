package com.cineverse.bookingservice.controller;

import com.cineverse.bookingservice.dto.ShowDto;
import com.cineverse.bookingservice.dto.StandardResponse;
import com.cineverse.bookingservice.entity.Show;
import com.cineverse.bookingservice.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @PostMapping
    public ResponseEntity<StandardResponse<Show>> createShow(@Valid @RequestBody ShowDto dto) {
        Show show = showService.createShow(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Show created successfully", show));
    }

    @GetMapping
    public ResponseEntity<StandardResponse<List<Show>>> getAllShows() {
        return ResponseEntity.ok(StandardResponse.success("Shows fetched successfully", showService.getAllShows()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse<Show>> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(StandardResponse.success("Show fetched successfully", showService.getShowById(id)));
    }
}
