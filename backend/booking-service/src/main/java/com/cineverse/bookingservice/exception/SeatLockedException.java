package com.cineverse.bookingservice.exception;

/**
 * Custom exception thrown when a seat is locked in Redis by another user.
 */
public class SeatLockedException extends RuntimeException {
    public SeatLockedException(String message) {
        super(message);
    }
}
