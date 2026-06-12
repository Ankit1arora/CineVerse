import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/Analytics.css';

const Analytics = () => {
  const [bookingTrends, setBookingTrends] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trends, revenue] = await Promise.all([
          analyticsService.getBookingTrends(),
          analyticsService.getRevenueStats(),
        ]);
        setBookingTrends(trends);
        setRevenueStats(revenue);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const maxBookings = Math.max(...bookingTrends.map((t) => t.bookings));
  const maxRevenue = Math.max(...revenueStats.map((r) => r.revenue));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>System-wide analytics and reports</p>
      </div>

      <div className="analytics-grid">
        <Card className="chart-card">
          <h2>Booking Trends (Last 7 Days)</h2>
          <div className="chart">
            {bookingTrends.map((trend) => (
              <div key={trend.date} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ height: `${(trend.bookings / maxBookings) * 200}px` }}
                />
                <span className="chart-label">{trend.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="chart-card">
          <h2>Revenue by Month</h2>
          <div className="chart">
            {revenueStats.map((stat) => (
              <div key={stat.month} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ height: `${(stat.revenue / maxRevenue) * 200}px` }}
                />
                <span className="chart-label">{stat.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="stats-summary">
        <h2>Summary Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Bookings</td>
              <td>5,432</td>
              <td className="positive">+12%</td>
            </tr>
            <tr>
              <td>Revenue</td>
              <td>₹28,43,200</td>
              <td className="positive">+8%</td>
            </tr>
            <tr>
              <td>Active Users</td>
              <td>1,254</td>
              <td className="positive">+15%</td>
            </tr>
            <tr>
              <td>Average Rating</td>
              <td>4.5/5</td>
              <td className="positive">+0.2</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Analytics;
