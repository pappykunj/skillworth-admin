import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import HomePage from './HomePage';
import UsersPage from './UsersPage';
import ReelsPage from './ReelsPage';
import AddReelPage from './AddReelPage'; // Import the new component
import AddUserPage from './AddUserPage'; // Import the new component
import SkillsPage from './SkillsPage';
import SubSkillsPage from './SubSkillsPage';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard/home' },
    { name: 'Users', path: '/dashboard/users' },
    { name: 'Reels', path: '/dashboard/reels' },
    { name: 'Skills', path: '/dashboard/skills' },
    { name: 'Sub-Skills', path: '/dashboard/sub-skills' },
  ];

  return (
    <div className="dashboard-layout">
      <Drawer navItems={navItems} />
      <main className="dashboard-content">
        <Routes>
          <Route path="home" element={<HomePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="reels" element={<ReelsPage />} />
          <Route path="reels/add" element={<AddReelPage />} /> {/* Add the new route */}
          <Route path="skills" element={<SkillsPage />} />
          <Route path="sub-skills" element={<SubSkillsPage />} />
          <Route path="*" element={<Navigate to="/dashboard/home" />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardPage;
