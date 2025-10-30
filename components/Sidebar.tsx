import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../data/mockData';
import { UserProfile } from '../types';

const Sidebar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const sidebarStyle: React.CSSProperties = {
    width: '256px',
    backgroundColor: '#1f2937', // bg-gray-800
    color: '#f9fafb', // text-gray-50
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    height: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
  };

  const profileSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    minHeight: '48px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    marginRight: '1rem',
    backgroundColor: '#374151', // bg-gray-700
  };

  const profileInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
  };

  const instrumentStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#d1d5db', // text-gray-300
    margin: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    borderTop: '1px solid #374151', // border-gray-700
    paddingTop: '1.5rem',
    marginTop: 0,
  };

  const navStyle: React.CSSProperties = {
    flexGrow: 1,
  };

  const renderProfile = () => {
    if (loading) {
      return <div>Loading profile...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    if (user) {
      return (
        <>
          <img src={user.avatarUrl} alt="User Avatar" style={avatarStyle} />
          <div style={profileInfoStyle}>
            <h3 style={nameStyle}>{user.name}</h3>
            <p style={instrumentStyle}>{user.instrument}</p>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <aside style={sidebarStyle} aria-label="Sidebar">
      <div style={profileSectionStyle}>
        {renderProfile()}
      </div>
      <h2 style={titleStyle}>My App</h2>
      <nav style={navStyle}>
        <ul>
          {/* Menu items will be added here */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
