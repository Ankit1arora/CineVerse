import apiClient from './apiClient';

// Mock delay function for simulating API calls
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // In production, this would call the actual auth service
  login: async (email, password) => {
    await mockDelay();
    
    // Mock login logic
    if (email && password) {
      const mockUsers = {
        'user@example.com': {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'user',
          phone: '9876543210',
          address: '123 Main St, City',
          joinedAt: '2024-01-15',
        },
        'owner@example.com': {
          id: '2',
          email: 'owner@example.com',
          name: 'Theatre Owner',
          role: 'theatre_owner',
          theatreName: 'Grand Cinema',
          phone: '9876543211',
          joinedAt: '2024-01-10',
        },
        'admin@example.com': {
          id: '3',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          phone: '9876543212',
          joinedAt: '2024-01-01',
        },
      };

      const user = mockUsers[email];
      if (user && password === 'password') {
        const token = `mock_token_${user.id}_${Date.now()}`;
        return { user, token };
      }
      throw new Error('Invalid credentials');
    }
    throw new Error('Email and password required');
  },

  register: async (userData) => {
    await mockDelay();
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      joinedAt: new Date().toISOString(),
    };
    
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    return { user: newUser, token };
  },

  logout: async () => {
    await mockDelay();
    return { success: true };
  },

  // Backend integration ready - will replace mock with real API
  loginWithBackend: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
