import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, Calendar, Edit2, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/Profile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-layout">
        <Card className="profile-card">
          <div className="profile-header">
            <div className="avatar-large">{user?.name?.charAt(0)}</div>
            <div className="profile-name">
              <h2>{user?.name}</h2>
              <p className="profile-role">Regular User</p>
            </div>
            {!isEditing && (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <Button 
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleSave}
                >
                  <Save size={18} />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <span className="label">Email</span>
                  <p>{formData.email}</p>
                </div>
              </div>

              <div className="info-item">
                <Phone size={20} />
                <div>
                  <span className="label">Phone</span>
                  <p>{formData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <span className="label">Address</span>
                  <p>{formData.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="label">Member Since</span>
                  <p>{user?.joinedAt}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="profile-stats">
          <Card className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-value">5</p>
          </Card>

          <Card className="stat-card">
            <h3>Reviews Written</h3>
            <p className="stat-value">12</p>
          </Card>

          <Card className="stat-card">
            <h3>Favorite Movies</h3>
            <p className="stat-value">8</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
