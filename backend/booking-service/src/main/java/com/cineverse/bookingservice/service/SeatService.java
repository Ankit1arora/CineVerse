package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.entity.Seat;
import com.cineverse.bookingservice.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    public List<Seat> getSeatsByShow(Long showId) {
        return seatRepository.findByShowId(showId);
    }
}
