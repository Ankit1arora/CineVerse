package com.cineverse.movieservice.controller;

import com.cineverse.movieservice.dto.MovieDto;
import com.cineverse.movieservice.dto.StandardResponse;
import com.cineverse.movieservice.entity.Movie;
import com.cineverse.movieservice.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Movie operations.
 */
@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<StandardResponse<Movie>> createMovie(@Valid @RequestBody MovieDto movieDto) {
        Movie createdMovie = movieService.createMovie(movieDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Movie created successfully", createdMovie));
    }

    @GetMapping
    public ResponseEntity<StandardResponse<Page<Movie>>> getAllMovies(Pageable pageable) {
        Page<Movie> movies = movieService.getAllMovies(pageable);
        return ResponseEntity.ok(StandardResponse.success("Movies fetched successfully", movies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse<Movie>> getMovieById(@PathVariable String id) {
        Movie movie = movieService.getMovieById(id);
        return ResponseEntity.ok(StandardResponse.success("Movie fetched successfully", movie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse<Movie>> updateMovie(
            @PathVariable String id, @Valid @RequestBody MovieDto movieDto) {
        Movie updatedMovie = movieService.updateMovie(id, movieDto);
        return ResponseEntity.ok(StandardResponse.success("Movie updated successfully", updatedMovie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse<Void>> deleteMovie(@PathVariable String id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(StandardResponse.success("Movie deleted successfully", null));
    }

    // --- Search APIs ---

    @GetMapping("/search")
    public ResponseEntity<StandardResponse<List<Movie>>> searchByTitle(@RequestParam String title) {
        List<Movie> movies = movieService.searchByTitle(title);
        return ResponseEntity.ok(StandardResponse.success("Movies searched by title", movies));
    }

    @GetMapping("/genre")
    public ResponseEntity<StandardResponse<List<Movie>>> searchByGenre(@RequestParam String genre) {
        List<Movie> movies = movieService.searchByGenre(genre);
        return ResponseEntity.ok(StandardResponse.success("Movies searched by genre", movies));
    }

    @GetMapping("/rating")
    public ResponseEntity<StandardResponse<List<Movie>>> searchByRating(@RequestParam Double rating) {
        List<Movie> movies = movieService.searchByRating(rating);
        return ResponseEntity.ok(StandardResponse.success("Movies searched by rating", movies));
    }

    // --- File Upload API ---

    @PostMapping("/upload")
    public ResponseEntity<StandardResponse<Map<String, String>>> uploadPoster(@RequestParam("file") MultipartFile file) {
        try {
            // Create uploads directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique file name
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : ".jpg";
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            // Save file
            Path path = Paths.get(uploadDir + uniqueFileName);
            Files.write(path, file.getBytes());

            // Return filename
            Map<String, String> responseData = new HashMap<>();
            responseData.put("fileName", uniqueFileName);

            return ResponseEntity.ok(StandardResponse.success("File uploaded successfully", responseData));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Could not upload file: " + e.getMessage()));
        }
    }
}
