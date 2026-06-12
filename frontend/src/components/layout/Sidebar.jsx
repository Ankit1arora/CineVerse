import React from 'react';
import {
  LayoutDashboard,
  Film,
  Users,
  BarChart3,
  Clapperboard,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/helpers';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const userMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user/dashboard' },
    { icon: Film, label: 'Movies', path: '/user/movies' },
    { icon: Clapperboard, label: 'My Bookings', path: '/user/bookings' },
  ];

  const theatreMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/theatre/dashboard' },
    { icon: Clapperboard, label: 'Manage Shows', path: '/theatre/shows' },
    { icon: Plus, label: 'Add Movie', path: '/theatre/add-movie' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: Film, label: 'Manage Movies', path: '/admin/movies' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case ROLES.USER:
        return userMenuItems;
      case ROLES.THEATRE_OWNER:
        return theatreMenuItems;
      case ROLES.ADMIN:
        return adminMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${active ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {active && <ChevronDown size={16} className="chevron" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
