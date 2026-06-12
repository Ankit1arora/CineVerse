import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { formatDate, formatCurrency } from '../../utils/helpers';
import '../../styles/Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await userService.getUserBookings('1');
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your movie bookings</p>
      </div>

      <div className="filter-buttons">
        {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredBookings.length > 0 ? (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking ID: {booking.id}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Date:</strong> {formatDate(booking.bookingDate)}</p>
                <p><strong>Show:</strong> {formatDate(booking.showDate)} at {booking.showTime}</p>
                <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                <p><strong>Total:</strong> {formatCurrency(booking.totalPrice)}</p>
              </div>
              <div className="booking-actions">
                <Button variant="secondary" size="sm">View Ticket</Button>
                <Button variant="primary" size="sm">Manage Booking</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="empty-bookings">
          <p>No bookings found</p>
        </Card>
      )}
    </div>
  );
};

export default Bookings;
