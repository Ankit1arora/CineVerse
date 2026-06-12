import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { theatreService } from '../../services/theatreService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/ManageShows.css';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    screen: '',
    showTime: '',
    format: '2D',
    language: 'English',
    price: '',
  });

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await theatreService.getTheatreShows('1');
        setShows(data);
      } catch (error) {
        console.error('Failed to load shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    // Mock submission - would integrate with backend
    const newShow = { ...formData, id: Date.now().toString() };
    setShows((prev) => [newShow, ...prev]);
    setFormData({
      movieId: '',
      screen: '',
      showTime: '',
      format: '2D',
      language: 'English',
      price: '',
    });
    setIsModalOpen(false);
  };

  const handleDeleteShow = (id) => {
    setShows((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Shows</h1>
        <Button 
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add New Show
        </Button>
      </div>

      <div className="shows-management">
        {shows.length > 0 ? (
          shows.map((show) => (
            <Card key={show.id} className="show-item">
              <div className="show-header">
                <h3>Screen {show.screen}</h3>
                <span className="format-badge">{show.format}</span>
              </div>
              <div className="show-info">
                <p><strong>Time:</strong> {show.showTime}</p>
                <p><strong>Language:</strong> {show.language}</p>
                <p><strong>Price:</strong> ₹{show.price}</p>
              </div>
              <div className="show-actions">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setEditingShow(show)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDeleteShow(show.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No shows added yet</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add New Show"
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleAddShow} className="show-form">
          <div className="form-group">
            <label>Movie ID</label>
            <input
              type="text"
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Screen Number</label>
            <input
              type="number"
              name="screen"
              value={formData.screen}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Show Time</label>
            <input
              type="time"
              name="showTime"
              value={formData.showTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Format</label>
            <select name="format" value={formData.format} onChange={handleChange}>
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Show
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageShows;
