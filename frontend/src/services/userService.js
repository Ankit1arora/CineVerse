import apiClient from './apiClient';

const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    await mockDelay();
    return mockUsers;
  },

  // Get user by ID
  getUserById: async (id) => {
    await mockDelay();
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    await mockDelay();
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user, ...profileData };
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    await mockDelay();
    return mockBookings.filter((b) => b.userId === userId);
  },

  // Backend integration ready
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    phone: '9876543210',
    address: '123 Main St, City',
    joinedAt: '2024-01-15',
    avatar: 'https://via.placeholder.com/96?text=JD',
    bookings: 5,
    status: 'active',
  },
  {
    id: '2',
    email: 'owner@example.com',
    name: 'Theatre Owner',
    role: 'theatre_owner',
    phone: '9876543211',
    theatreName: 'Grand Cinema',
    theatreAddress: '456 Cinema Ave, City',
    joinedAt: '2024-01-10',
    avatar: 'https://via.placeholder.com/96?text=TO',
    screens: 4,
    status: 'active',
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    phone: '9876543212',
    joinedAt: '2024-01-01',
    avatar: 'https://via.placeholder.com/96?text=AU',
    status: 'active',
  },
  {
    id: '4',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
    phone: '9876543213',
    address: '789 Oak St, City',
    joinedAt: '2024-01-12',
    avatar: 'https://via.placeholder.com/96?text=JS',
    bookings: 2,
    status: 'active',
  },
];

const mockBookings = [
  {
    id: '1',
    userId: '1',
    movieId: '1',
    theatreId: '1',
    showDate: '2024-02-15',
    showTime: '19:00',
    seats: ['A1', 'A2'],
    totalPrice: 400,
    bookingDate: '2024-02-10',
    status: 'confirmed',
  },
];
