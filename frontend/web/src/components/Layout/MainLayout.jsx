import React from 'react';
import { Home, Compass, Plus, Send, User } from 'lucide-react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import FeedScreen from '../Feed/FeedScreen';
import ExploreScreen from '../Explore/ExploreScreen';
import CameraScreen from '../Camera/CameraScreen';
import MessagingScreen from '../Messaging/MessagingScreen';
import ProfileScreen from '../Profile/ProfileScreen';
import './MainLayout.css';

function MainLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('feed');

  const tabs = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'messages', icon: Send, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  return (
    <div className="main-layout">
      <div className="main-content">
        <Routes>
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/create" element={<CameraScreen />} />
          <Route path="/messages" element={<MessagingScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/feed" />} />
        </Routes>
      </div>

      <nav className="bottom-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
            >
              {tab.id === 'create' ? (
                <div className="nav-create-btn">
                  <Icon size={24} color="white" />
                </div>
              ) : (
                <Icon size={isActive ? 24 : 20} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default MainLayout;
