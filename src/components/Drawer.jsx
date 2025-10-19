import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaVideo, FaCog, FaSignOutAlt, FaTimes, FaLightbulb } from 'react-icons/fa';
import apiClient from '../api';
import '../styles/Drawer.css';

// Mapping of nav item names to icons
const navIcons = {
  Home: <FaHome />,
  Users: <FaUsers />,
  Reels: <FaVideo />,
  Skills: <FaCog />,
  'Sub-Skills': <FaLightbulb />
};

const Drawer = ({ navItems, open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`drawer ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <h2>Admin</h2>
        <button onClick={onClose} className="drawer-close-button
">
          <FaTimes />
        </button>
      </div>
      <div className="drawer-content">
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                  {navIcons[item.name] || <FaCog />} {/* Fallback icon */}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="logout-button-container">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Drawer;
