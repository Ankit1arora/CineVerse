package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.dto.ScreenDto;
import com.cineverse.bookingservice.entity.Screen;
import com.cineverse.bookingservice.repository.ScreenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreenService {

    private final ScreenRepository screenRepository;

    public Screen createScreen(ScreenDto dto) {
        Screen screen = new Screen();
        screen.setName(dto.getName());
        screen.setCapacity(dto.getCapacity());
        screen.setTheatreId(dto.getTheatreId());
        return screenRepository.save(screen);
    }

    public List<Screen> getScreensByTheatre(Long theatreId) {
        return screenRepository.findByTheatreId(theatreId);
    }

    public Screen getScreenById(Long id) {
        return screenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Screen not found"));
    }
}
