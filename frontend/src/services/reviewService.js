import apiClient from './apiClient';

const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const reviewService = {
  // Get reviews for a movie
  getMovieReviews: async (movieId) => {
    await mockDelay();
    return mockReviews.filter((r) => r.movieId === movieId);
  },

  // Get review by ID
  getReviewById: async (id) => {
    await mockDelay();
    const review = mockReviews.find((r) => r.id === id);
    if (!review) throw new Error('Review not found');
    return review;
  },

  // Add review
  addReview: async (movieId, reviewData) => {
    await mockDelay();
    const newReview = {
      id: Date.now().toString(),
      movieId,
      ...reviewData,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    return newReview;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    await mockDelay();
    const review = mockReviews.find((r) => r.id === id);
    if (!review) throw new Error('Review not found');
    return { ...review, ...reviewData };
  },

  // Delete review
  deleteReview: async (id) => {
    await mockDelay();
    return { success: true };
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    await mockDelay();
    return mockReviews.filter((r) => r.userId === userId);
  },

  // Backend integration ready
  submitReview: async (movieId, reviewData) => {
    try {
      const response = await apiClient.post(`/movies/${movieId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Mock data
const mockReviews = [
  {
    id: '1',
    movieId: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://via.placeholder.com/48?text=JD',
    rating: 9,
    title: 'Amazing Concept!',
    content:
      'Inception is a masterpiece. The storyline is intricate and the plot twists keep you engaged throughout.',
    helpful: 542,
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    movieId: '1',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://via.placeholder.com/48?text=JS',
    rating: 8,
    title: 'Good but confusing',
    content:
      'While the concept is brilliant, some parts of the movie can be confusing. Definitely worth a watch!',
    helpful: 234,
    createdAt: '2024-01-18T15:45:00Z',
  },
  {
    id: '3',
    movieId: '2',
    userId: '3',
    userName: 'Mike Johnson',
    userAvatar: 'https://via.placeholder.com/48?text=MJ',
    rating: 10,
    title: 'Best Batman Movie Ever!',
    content:
      'Heath Ledger\'s portrayal of Joker is iconic. The movie has everything - action, drama, and outstanding performances.',
    helpful: 890,
    createdAt: '2024-01-15T09:15:00Z',
  },
];
