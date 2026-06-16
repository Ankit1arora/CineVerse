package com.cineverse.bookingservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * SeatLockService manages seat locks in Redis.
 *
 * How it works:
 * - When a user selects a seat, we store a key in Redis like: seat:1:A1
 * - This key expires automatically after 5 minutes (TTL)
 * - If another user tries the same seat, they see the lock exists and are rejected
 * - Once booking is confirmed, the lock is removed manually
 */
@Service
@RequiredArgsConstructor
public class SeatLockService {

    private final RedisTemplate<String, String> redisTemplate;

    // TTL duration: 5 minutes (300 seconds)
    private static final long LOCK_TIMEOUT_MINUTES = 5;

    /**
     * Generates the Redis key for a specific seat in a specific show.
     * Format: seat:showId:seatNumber (e.g., seat:1:A1)
     */
    private String buildKey(Long showId, String seatNumber) {
        return "seat:" + showId + ":" + seatNumber;
    }

    /**
     * Try to lock a seat.
     *
     * @return true  if lock was acquired (seat was free)
     * @return false if lock already exists (seat is taken by someone else)
     */
    public boolean lockSeat(Long showId, String seatNumber) {
        String key = buildKey(showId, seatNumber);

        // setIfAbsent is Redis "SET key value NX EX timeout"
        // It sets the key ONLY if it does NOT already exist — atomic operation
        Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(key, "LOCKED", LOCK_TIMEOUT_MINUTES, TimeUnit.MINUTES);

        // If locked is null (unexpected), treat as failure
        return Boolean.TRUE.equals(locked);
    }

    /**
     * Release the Redis lock for a seat.
     * Called after a booking is confirmed or cancelled.
     */
    public void releaseSeat(Long showId, String seatNumber) {
        String key = buildKey(showId, seatNumber);
        redisTemplate.delete(key);
    }

    /**
     * Check if a seat is currently available (no Redis lock).
     *
     * @return true  if no lock exists (seat is free)
     * @return false if lock exists (seat is locked or booked)
     */
    public boolean isSeatAvailable(Long showId, String seatNumber) {
        String key = buildKey(showId, seatNumber);
        return !Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
