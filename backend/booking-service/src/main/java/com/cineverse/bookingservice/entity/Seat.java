package com.cineverse.bookingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long showId;
    private String seatNumber;
    private Double price;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    public enum SeatStatus {
        AVAILABLE, LOCKED, BOOKED
    }
}
