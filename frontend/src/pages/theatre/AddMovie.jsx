import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/AddMovie.css';

const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genres: '',
    releaseDate: '',
    duration: '',
    language: 'English',
    description: '',
    cast: '',
    poster: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, poster: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission - would integrate with backend
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        title: '',
        director: '',
        genres: '',
        releaseDate: '',
        duration: '',
        language: 'English',
        description: '',
        cast: '',
        poster: null,
      });
      alert('Movie added successfully!');
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Movie</h1>
        <p>Add a new movie to your theatre</p>
      </div>

      <Card className="form-card">
        <form onSubmit={handleSubmit} className="add-movie-form">
          <div className="form-row">
            <div className="form-group">
              <label>Movie Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Director *</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genres (comma-separated) *</label>
              <input
                type="text"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="e.g., Action, Drama"
                required
              />
            </div>
            <div className="form-group">
              <label>Language</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Release Date *</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cast (comma-separated) *</label>
            <input
              type="text"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              placeholder="Actor names"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Movie Poster</label>
            <div className="file-input-wrapper">
              <Upload size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span>{formData.poster?.name || 'Click to upload poster'}</span>
            </div>
          </div>

          <div className="form-actions">
            <Button type="reset" variant="secondary">
              Clear
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Add Movie
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddMovie;
