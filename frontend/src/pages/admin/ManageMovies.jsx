import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { movieService } from '../../services/movieService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/ManageMovies.css';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: '',
    releaseDate: '',
    duration: '',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        setMovies(data);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const newMovie = { ...formData, id: Date.now().toString() };
    setMovies((prev) => [newMovie, ...prev]);
    setFormData({
      title: '',
      director: '',
      genre: '',
      releaseDate: '',
      duration: '',
    });
    setIsModalOpen(false);
  };

  const handleDeleteMovie = (id) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Movies</h1>
        <Button 
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Movie
        </Button>
      </div>

      <div className="movies-management">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Card key={movie.id} className="movie-item">
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="director">{movie.director}</p>
                <p className="genre">{movie.genre}</p>
                <p className="details">
                  {movie.duration} min • Released {movie.releaseDate}
                </p>
              </div>
              <div className="movie-actions">
                <Button variant="secondary" size="sm">
                  <Edit2 size={16} />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDeleteMovie(movie.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add New Movie"
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleAddMovie} className="movie-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Director</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Movie
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageMovies;
