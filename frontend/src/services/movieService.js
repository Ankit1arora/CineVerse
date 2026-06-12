import apiClient from './apiClient';

const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const movieService = {
  // Get all movies
  getAllMovies: async () => {
    await mockDelay();
    // Will be replaced with: return apiClient.get('/movies');
    return mockMovies;
  },

  // Get movie by ID
  getMovieById: async (id) => {
    await mockDelay();
    const movie = mockMovies.find((m) => m.id === id);
    if (!movie) throw new Error('Movie not found');
    return movie;
  },

  // Get movies by genre
  getMoviesByGenre: async (genre) => {
    await mockDelay();
    return mockMovies.filter((m) => m.genres.includes(genre));
  },

  // Search movies
  searchMovies: async (query) => {
    await mockDelay();
    const q = query.toLowerCase();
    return mockMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    );
  },

  // Get trending movies
  getTrendingMovies: async () => {
    await mockDelay();
    return mockMovies.sort((a, b) => b.rating - a.rating).slice(0, 8);
  },

  // Backend integration ready
  addMovie: async (movieData) => {
    try {
      const response = await apiClient.post('/movies', movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateMovie: async (id, movieData) => {
    try {
      const response = await apiClient.put(`/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteMovie: async (id) => {
    try {
      const response = await apiClient.delete(`/movies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Mock data
const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi, Thriller',
    genres: ['sci-fi', 'thriller'],
    releaseDate: '2010-07-16',
    rating: 8.8,
    duration: 148,
    language: 'English',
    poster: 'https://via.placeholder.com/300x450?text=Inception',
    backdrop: 'https://via.placeholder.com/1920x1080?text=Inception',
    description:
      'A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Joseph Gordon-Levitt'],
    budget: '$160 million',
    boxOffice: '$839 million',
    reviews: 1200,
  },
  {
    id: '2',
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action, Crime, Drama',
    genres: ['action', 'crime', 'drama'],
    releaseDate: '2008-07-18',
    rating: 9.0,
    duration: 152,
    language: 'English',
    poster: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
    backdrop: 'https://via.placeholder.com/1920x1080?text=The+Dark+Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    budget: '$185 million',
    boxOffice: '$1.005 billion',
    reviews: 1500,
  },
  {
    id: '3',
    title: 'Interstellar',
    director: 'Christopher Nolan',
    genre: 'Adventure, Drama, Sci-Fi',
    genres: ['adventure', 'drama', 'sci-fi'],
    releaseDate: '2014-11-07',
    rating: 8.6,
    duration: 169,
    language: 'English',
    poster: 'https://via.placeholder.com/300x450?text=Interstellar',
    backdrop: 'https://via.placeholder.com/1920x1080?text=Interstellar',
    description:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    budget: '$165 million',
    boxOffice: '$731 million',
    reviews: 1300,
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'Crime, Drama',
    genres: ['crime', 'drama'],
    releaseDate: '1994-10-14',
    rating: 8.9,
    duration: 154,
    language: 'English',
    poster: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
    backdrop: 'https://via.placeholder.com/1920x1080?text=Pulp+Fiction',
    description:
      'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence.',
    cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
    budget: '$8.5 million',
    boxOffice: '$213 million',
    reviews: 900,
  },
  {
    id: '5',
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: 'Drama',
    genres: ['drama'],
    releaseDate: '1994-09-23',
    rating: 9.3,
    duration: 142,
    language: 'English',
    poster: 'https://via.placeholder.com/300x450?text=Shawshank+Redemption',
    backdrop: 'https://via.placeholder.com/1920x1080?text=Shawshank+Redemption',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    cast: ['Tim Robbins', 'Morgan Freeman'],
    budget: '$25 million',
    boxOffice: '$58 million',
    reviews: 1100,
  },
];
