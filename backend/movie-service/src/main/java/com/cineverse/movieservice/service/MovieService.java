package com.cineverse.movieservice.service;

import com.cineverse.movieservice.dto.MovieDto;
import com.cineverse.movieservice.entity.Movie;
import com.cineverse.movieservice.exception.MovieNotFoundException;
import com.cineverse.movieservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class handling business logic for movies.
 */
@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public Movie createMovie(MovieDto movieDto) {
        Movie movie = new Movie();
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setGenre(movieDto.getGenre());
        movie.setLanguage(movieDto.getLanguage());
        movie.setDuration(movieDto.getDuration());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setRating(movieDto.getRating());
        movie.setPosterUrl(movieDto.getPosterUrl());
        
        return movieRepository.save(movie);
    }

    public Page<Movie> getAllMovies(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    public Movie getMovieById(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + id));
    }

    public Movie updateMovie(String id, MovieDto movieDto) {
        Movie existingMovie = getMovieById(id); // Throws exception if not found
        
        existingMovie.setTitle(movieDto.getTitle());
        existingMovie.setDescription(movieDto.getDescription());
        existingMovie.setGenre(movieDto.getGenre());
        existingMovie.setLanguage(movieDto.getLanguage());
        existingMovie.setDuration(movieDto.getDuration());
        existingMovie.setReleaseDate(movieDto.getReleaseDate());
        existingMovie.setRating(movieDto.getRating());
        existingMovie.setPosterUrl(movieDto.getPosterUrl());
        
        return movieRepository.save(existingMovie);
    }

    public void deleteMovie(String id) {
        if (!movieRepository.existsById(id)) {
            throw new MovieNotFoundException("Movie not found with ID: " + id);
        }
        movieRepository.deleteById(id);
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> searchByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> searchByRating(Double rating) {
        return movieRepository.findByRatingGreaterThanEqual(rating);
    }
}
