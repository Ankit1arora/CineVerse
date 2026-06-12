import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { theatreService } from '../../services/theatreService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/pages.css';

const TheatreDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data - in production would fetch from backend
        setStats({
          totalShows: 24,
          activeMovies: 8,
          totalRevenue: 450000,
          totalBookings: 180,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Theatre Dashboard</h1>
        <p>Manage your theatre and shows</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <h3>Active Shows</h3>
          <p className="stat-number">{stats?.totalShows}</p>
        </Card>
        <Card className="stat-card">
          <h3>Movies Running</h3>
          <p className="stat-number">{stats?.activeMovies}</p>
        </Card>
        <Card className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats?.totalBookings}</p>
        </Card>
        <Card className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">₹{stats?.totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      <section className="page-section">
        <h2>Theatre Info</h2>
        <Card className="info-card">
          <div className="info-grid">
            <div>
              <span className="label">Theatre Name</span>
              <p>{user?.theatreName}</p>
            </div>
            <div>
              <span className="label">Location</span>
              <p>{user?.theatreAddress}</p>
            </div>
            <div>
              <span className="label">Contact</span>
              <p>{user?.phone}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TheatreDashboard;
