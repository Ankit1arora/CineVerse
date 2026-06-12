import apiClient from './apiClient';

const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const theatreService = {
  // Get all theatres
  getAllTheatres: async () => {
    await mockDelay();
    return mockTheatres;
  },

  // Get theatre by ID
  getTheatreById: async (id) => {
    await mockDelay();
    const theatre = mockTheatres.find((t) => t.id === id);
    if (!theatre) throw new Error('Theatre not found');
    return theatre;
  },

  // Get shows for a theatre
  getTheatreShows: async (theatreId) => {
    await mockDelay();
    return mockShows.filter((s) => s.theatreId === theatreId);
  },

  // Get shows for a movie
  getMovieShows: async (movieId) => {
    await mockDelay();
    return mockShows.filter((s) => s.movieId === movieId);
  },

  // Backend integration ready
  addShow: async (theatreId, showData) => {
    try {
      const response = await apiClient.post(`/theatres/${theatreId}/shows`, showData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateShow: async (theatreId, showId, showData) => {
    try {
      const response = await apiClient.put(
        `/theatres/${theatreId}/shows/${showId}`,
        showData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteShow: async (theatreId, showId) => {
    try {
      const response = await apiClient.delete(`/theatres/${theatreId}/shows/${showId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Mock data
const mockTheatres = [
  {
    id: '1',
    name: 'Grand Cinema',
    owner: 'Theatre Owner',
    ownerId: '2',
    address: '456 Cinema Ave, City',
    phone: '9876543211',
    screens: 4,
    totalSeats: 1200,
    amenities: ['Parking', 'Food Court', '4K Projection', 'Dolby Atmos'],
    rating: 4.5,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Star Multiplex',
    owner: 'Star Theatres',
    ownerId: '2',
    address: '123 Star Lane, City',
    phone: '9876543214',
    screens: 6,
    totalSeats: 1800,
    amenities: ['Premium Seating', 'IMAX', 'VIP Lounge', 'Food Court'],
    rating: 4.7,
    reviews: 456,
  },
];

const mockShows = [
  {
    id: '1',
    theatreId: '1',
    movieId: '1',
    screen: 1,
    showTime: '10:00 AM',
    duration: 148,
    format: '2D',
    language: 'English',
    price: 200,
    availableSeats: 85,
    totalSeats: 100,
    date: '2024-02-15',
  },
  {
    id: '2',
    theatreId: '1',
    movieId: '1',
    screen: 2,
    showTime: '01:30 PM',
    duration: 148,
    format: '3D',
    language: 'English',
    price: 250,
    availableSeats: 45,
    totalSeats: 100,
    date: '2024-02-15',
  },
  {
    id: '3',
    theatreId: '1',
    movieId: '2',
    screen: 3,
    showTime: '04:00 PM',
    duration: 152,
    format: '2D',
    language: 'English',
    price: 200,
    availableSeats: 60,
    totalSeats: 100,
    date: '2024-02-15',
  },
];
