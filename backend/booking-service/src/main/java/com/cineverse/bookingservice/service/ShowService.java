package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.dto.ShowDto;
import com.cineverse.bookingservice.entity.Screen;
import com.cineverse.bookingservice.entity.Seat;
import com.cineverse.bookingservice.entity.Show;
import com.cineverse.bookingservice.repository.ScreenRepository;
import com.cineverse.bookingservice.repository.SeatRepository;
import com.cineverse.bookingservice.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final RestTemplate restTemplate;

    @Value("${movie.service.url}")
    private String movieServiceUrl;

    public Show createShow(ShowDto dto) {
        // Validate movie exists by calling Movie Service
        try {
            restTemplate.getForEntity(movieServiceUrl + "/movies/" + dto.getMovieId(), Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Movie ID or Movie Service is down");
        }

        // Validate screen
        Screen screen = screenRepository.findById(dto.getScreenId())
                .orElseThrow(() -> new RuntimeException("Screen not found"));

        Show show = new Show();
        show.setMovieId(dto.getMovieId());
        show.setScreenId(dto.getScreenId());
        show.setShowTime(dto.getShowTime());

        Show savedShow = showRepository.save(show);

        // Auto-generate seats for this show based on screen capacity
        generateSeatsForShow(savedShow, screen.getCapacity());

        return savedShow;
    }

    private void generateSeatsForShow(Show show, int capacity) {
        List<Seat> seats = new ArrayList<>();
        // Simple seat numbering: A1, A2... B1, B2...
        char row = 'A';
        int num = 1;
        for (int i = 0; i < capacity; i++) {
            Seat seat = new Seat();
            seat.setShowId(show.getId());
            seat.setSeatNumber(row + String.valueOf(num));
            seat.setPrice(200.0); // Default flat price
            seat.setStatus(Seat.SeatStatus.AVAILABLE);
            seats.add(seat);

            num++;
            if (num > 10) { // 10 seats per row for simplicity
                num = 1;
                row++;
            }
        }
        seatRepository.saveAll(seats);
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    // @Cacheable: First call hits the DB and stores result in Redis under key "shows::id"
    // Subsequent calls with the same id are served directly from Redis cache
    @Cacheable(value = "shows", key = "#id")
    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
    }
}
