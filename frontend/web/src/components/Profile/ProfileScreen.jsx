import React from 'react';
import { useAuthStore } from '../../context/authStore';
import { LogOut, Settings } from 'lucide-react';

function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.username || 'User'}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <strong>0</strong>
          <span>Posts</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Followers</span>
        </div>
        <div className="stat">
          <strong>0</strong>
          <span>Following</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-secondary">
          <Settings size={20} /> Settings
        </button>
        <button className="btn btn-alert" onClick={logout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;
