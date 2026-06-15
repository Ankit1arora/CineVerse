package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.dto.TheatreDto;
import com.cineverse.bookingservice.entity.Theatre;
import com.cineverse.bookingservice.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheatreService {

    private final TheatreRepository theatreRepository;

    public Theatre createTheatre(TheatreDto dto) {
        Theatre theatre = new Theatre();
        theatre.setName(dto.getName());
        theatre.setLocation(dto.getLocation());
        return theatreRepository.save(theatre);
    }

    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    public Theatre getTheatreById(Long id) {
        return theatreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));
    }
}
