import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import SkillsPage from './SkillsPage';
import SubSkillsPage from './SubSkillsPage'; // Import the new page
import UsersPage from './UsersPage';
import ReelsPage from './ReelsPage';
import HomePage from './HomePage';
import { FaBars } from 'react-icons/fa';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // List of navigation items for the drawer
  const navItems = [
    { path: '/dashboard/home', name: 'Home', component: HomePage },
    { path: '/dashboard/users', name: 'Users', component: UsersPage },
    { path: '/dashboard/reels', name: 'Reels', component: ReelsPage },
    { path: '/dashboard/skills', name: 'Skills', component: SkillsPage },
    { path: '/dashboard/sub-skills', name: 'Sub-Skills', component: SubSkillsPage }, // Add new nav item
  ];

  return (
    <div className="dashboard-layout">
      <Drawer navItems={navItems} open={drawerOpen} onClose={toggleDrawer} />
      <main className={`main-content ${drawerOpen ? 'drawer-open' : ''}`}>
        <div className="dashboard-header">
          <button className="drawer-toggle-button" onClick={toggleDrawer}>
            <FaBars />
          </button>
          <h1>Dashboard</h1>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
          {navItems.map(item => (
            <Route key={item.path} path={item.path.replace('/dashboard', '')} element={<item.component />} />
          ))}
        </Routes>
      </main>
    </div>
  );
};

export default DashboardPage;
