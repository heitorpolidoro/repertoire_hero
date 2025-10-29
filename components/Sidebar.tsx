
import React from 'react';
import { FaTachometerAlt, FaPlus, FaSpotify, FaYoutube, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAppContext } from '../hooks/useAppContext';
import { getLevelDetails } from '../constants';
import Login from './Login';

interface SidebarProps {
  setView: (view: string, playlistId?: string) => void;
  activeView: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, activeView }) => {
  const { user, playlists, songs, logout } = useAppContext();

  const calculatePlaylistLevel = (playlistId: string): number => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.songIds.length === 0) return 0;

    const playlistSongs = songs.filter(song => playlist.songIds.includes(song.id));
    const totalLevel = playlistSongs.reduce((acc, song) => acc + song.level, 0);
    return Math.round(totalLevel / playlistSongs.length);
  };

  const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-400">Repertoire Hero</h1>
      </div>

      {user ? (
        <div className="flex items-center mb-8 p-3 bg-gray-900 rounded-lg justify-between">
          <div className="flex items-center">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-500" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.title || 'Musician'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <Login />
        </div>
      )}

      <nav className="flex-1 flex flex-col space-y-2">
        <div>
          <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</h2>
          <NavLink onClick={() => setView('dashboard')} isActive={activeView === 'dashboard'}>
            <FaTachometerAlt className="inline-block mr-3" /> Dashboard
          </NavLink>
          <NavLink onClick={() => setView('import')} isActive={activeView === 'import'}>
            <FaPlus className="inline-block mr-3" /> Import Playlist
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Playlists</h2>
          <div className="space-y-2">
            {playlists.map(playlist => {
              const avgLevel = calculatePlaylistLevel(playlist.id);
              const levelDetails = getLevelDetails(avgLevel);
              const Icon = playlist.source === 'spotify' ? FaSpotify : playlist.source === 'youtube' ? FaYoutube : FaUser;
              const iconColor = playlist.source === 'spotify' ? 'text-green-500' : playlist.source === 'youtube' ? 'text-red-500' : 'text-indigo-400';

              return (
                <NavLink key={playlist.id} onClick={() => setView('playlist', playlist.id)} isActive={activeView === playlist.id}>
                  <div className="flex items-center justify-between">
                    <span className="truncate">
                      <Icon className={`inline-block mr-3 ${iconColor}`} />
                      {playlist.name}
                    </span>
                    <span title={levelDetails.title} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${levelDetails.bgColor} ${levelDetails.color}`}>
                      {avgLevel}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {user && (
        <div className="mt-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center"
            title="Sign out"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
