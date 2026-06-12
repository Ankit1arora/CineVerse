import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, BookOpen, DollarSign, Building2 } from 'lucide-react';
import '../../styles/pages.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
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
        <h1>Admin Dashboard</h1>
        <p>System overview and analytics</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card-large">
          <div className="stat-header">
            <Users className="stat-icon" size={32} />
            <h3>Total Users</h3>
          </div>
          <p className="stat-number">{stats?.totalUsers}</p>
        </Card>

        <Card className="stat-card-large">
          <div className="stat-header">
            <BookOpen className="stat-icon" size={32} />
            <h3>Total Bookings</h3>
          </div>
          <p className="stat-number">{stats?.totalBookings}</p>
        </Card>

        <Card className="stat-card-large">
          <div className="stat-header">
            <DollarSign className="stat-icon" size={32} />
            <h3>Total Revenue</h3>
          </div>
          <p className="stat-number">₹{(stats?.totalRevenue / 100000).toFixed(1)}L</p>
        </Card>

        <Card className="stat-card-large">
          <div className="stat-header">
            <Building2 className="stat-icon" size={32} />
            <h3>Active Theatres</h3>
          </div>
          <p className="stat-number">{stats?.activeTheatres}</p>
        </Card>
      </div>

      <section className="page-section">
        <h2>Recent Activity</h2>
        <Card className="activity-card">
          <p>Activity log will appear here</p>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;
