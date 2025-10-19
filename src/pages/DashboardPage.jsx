import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import SkillsPage from './SkillsPage';
import SubSkillsPage from './SubSkillsPage';
import UsersPage from './UsersPage';
import ReelsPage from './ReelsPage';
import HomePage from './HomePage';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  // List of navigation items for the drawer
  const navItems = [
    { path: '/dashboard/home', name: 'Home', component: HomePage },
    { path: '/dashboard/users', name: 'Users', component: UsersPage },
    { path: '/dashboard/reels', name: 'Reels', component: ReelsPage },
    { path: '/dashboard/skills', name: 'Skills', component: SkillsPage },
    { path: '/dashboard/sub-skills', name: 'Sub-Skills', component: SubSkillsPage },
  ];

  return (
    <div className="dashboard-layout">
      <Drawer navItems={navItems} />
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
            {navItems.map(item => (
              <Route key={item.path} path={item.path.replace('/dashboard', '')} element={<item.component />} />
            ))}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
