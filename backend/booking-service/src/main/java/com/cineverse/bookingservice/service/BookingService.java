package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.dto.BookingDto;
import com.cineverse.bookingservice.entity.Booking;
import com.cineverse.bookingservice.entity.Seat;
import com.cineverse.bookingservice.exception.SeatAlreadyBookedException;
import com.cineverse.bookingservice.repository.BookingRepository;
import com.cineverse.bookingservice.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public Booking createBooking(BookingDto dto) {
        // Step 1: Select seat
        Seat seat = seatRepository.findByShowIdAndSeatNumber(dto.getShowId(), dto.getSeatNumber())
                .orElseThrow(() -> new RuntimeException("Seat not found for this show"));

        // Double booking prevention check
        if (seat.getStatus() == Seat.SeatStatus.BOOKED || seat.getStatus() == Seat.SeatStatus.LOCKED) {
            throw new SeatAlreadyBookedException("Seat " + dto.getSeatNumber() + " is already booked or locked");
        }

        // Step 2: Lock seat (simplified)
        seat.setStatus(Seat.SeatStatus.BOOKED);
        seatRepository.save(seat);

        // Step 3 & 4: Create and Confirm booking
        Booking booking = new Booking();
        booking.setUserName(dto.getUserName());
        booking.setShowId(dto.getShowId());
        booking.setSeatNumber(dto.getSeatNumber());
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }
}
