import apiClient from './apiClient';

const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    await mockDelay();
    return {
      totalUsers: 1254,
      totalBookings: 5432,
      totalRevenue: 2843200,
      activeTheatres: 45,
    };
  },

  // Get booking trends
  getBookingTrends: async () => {
    await mockDelay();
    return [
      { date: '2024-01-01', bookings: 120 },
      { date: '2024-01-02', bookings: 150 },
      { date: '2024-01-03', bookings: 140 },
      { date: '2024-01-04', bookings: 180 },
      { date: '2024-01-05', bookings: 165 },
      { date: '2024-01-06', bookings: 200 },
      { date: '2024-01-07', bookings: 220 },
    ];
  },

  // Get revenue stats
  getRevenueStats: async () => {
    await mockDelay();
    return [
      { month: 'Jan', revenue: 450000 },
      { month: 'Feb', revenue: 520000 },
      { month: 'Mar', revenue: 480000 },
      { month: 'Apr', revenue: 600000 },
      { month: 'May', revenue: 720000 },
      { month: 'Jun', revenue: 780000 },
    ];
  },

  // Backend integration ready
  getDetailedAnalytics: async (filter = {}) => {
    try {
      const response = await apiClient.get('/analytics', { params: filter });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
