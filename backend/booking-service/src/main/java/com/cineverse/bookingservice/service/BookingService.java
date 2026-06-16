package com.cineverse.bookingservice.service;

import com.cineverse.bookingservice.dto.BookingDto;
import com.cineverse.bookingservice.entity.Booking;
import com.cineverse.bookingservice.entity.Seat;
import com.cineverse.bookingservice.exception.SeatAlreadyBookedException;
import com.cineverse.bookingservice.exception.SeatLockedException;
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

    // Inject the new Redis locking service
    private final SeatLockService seatLockService;

    @Transactional
    public Booking createBooking(BookingDto dto) {
        // Step 1: Check Redis first — is the seat locked by someone else?
        if (!seatLockService.isSeatAvailable(dto.getShowId(), dto.getSeatNumber())) {
            throw new SeatLockedException("Seat " + dto.getSeatNumber() + " is currently locked by another user. Please try again.");
        }

        // Step 2: Try to acquire the Redis lock for this seat
        boolean locked = seatLockService.lockSeat(dto.getShowId(), dto.getSeatNumber());
        if (!locked) {
            // Lock failed — another user acquired it at the same moment
            throw new SeatLockedException("Seat " + dto.getSeatNumber() + " was just locked. Please try again.");
        }

        try {
            // Step 3: Double-check in the database (guard against already BOOKED seats)
            Seat seat = seatRepository.findByShowIdAndSeatNumber(dto.getShowId(), dto.getSeatNumber())
                    .orElseThrow(() -> new RuntimeException("Seat not found for this show"));

            if (seat.getStatus() == Seat.SeatStatus.BOOKED) {
                throw new SeatAlreadyBookedException("Seat " + dto.getSeatNumber() + " is already booked.");
            }

            // Step 4: Mark seat as BOOKED in PostgreSQL
            seat.setStatus(Seat.SeatStatus.BOOKED);
            seatRepository.save(seat);

            // Step 5: Create and confirm the booking
            Booking booking = new Booking();
            booking.setUserName(dto.getUserName());
            booking.setShowId(dto.getShowId());
            booking.setSeatNumber(dto.getSeatNumber());
            booking.setBookingTime(LocalDateTime.now());
            booking.setStatus(Booking.BookingStatus.CONFIRMED);

            Booking savedBooking = bookingRepository.save(booking);

            // Step 6: Release Redis lock — booking is confirmed, no longer needed
            seatLockService.releaseSeat(dto.getShowId(), dto.getSeatNumber());

            return savedBooking;

        } catch (Exception e) {
            // If anything goes wrong, release the Redis lock so others can book
            seatLockService.releaseSeat(dto.getShowId(), dto.getSeatNumber());
            throw e; // Re-throw the original exception
        }
    }
}
