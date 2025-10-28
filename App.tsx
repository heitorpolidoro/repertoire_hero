
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlaylistView from './components/PlaylistView';
import ImportView from './components/ImportView';
import MusicPlayer from './components/MusicPlayer';
import { useAppContext } from './hooks/useAppContext';
import type { Song } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const { songs, playlists, updateSongLevel } = useAppContext();

  useEffect(() => {
    // Syncs the local currentSong state with the master songs list from context.
    // This is necessary because updates (like changing a song's level) happen
    // in the context, and this component's local state needs to reflect that change.
    if (currentSong) {
      const updatedSongFromContext = songs.find(s => s.id === currentSong.id);
      
      // If the song exists in the context and is different from our local copy, update it.
      // We stringify for a simple deep comparison to avoid infinite re-render loops.
      if (updatedSongFromContext && JSON.stringify(updatedSongFromContext) !== JSON.stringify(currentSong)) {
        setCurrentSong(updatedSongFromContext);
      }
    }
  }, [songs, currentSong]);

  const handleSetView = (view: string, playlistId: string | null = null) => {
    setCurrentView(view);
    setActivePlaylistId(playlistId);
  };
  
  const currentPlaylist = playlists.find(p => p.id === activePlaylistId);
  const playlistSongs = currentPlaylist ? songs.filter(song => currentPlaylist.songIds.includes(song.id)) : [];

  const handlePlayNext = () => {
    if (!currentSong || !currentPlaylist) return;
    const currentIndex = playlistSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex > -1 && currentIndex < playlistSongs.length - 1) {
      setCurrentSong(playlistSongs[currentIndex + 1]);
    }
  };

  const handlePlayPrev = () => {
    if (!currentSong || !currentPlaylist) return;
    const currentIndex = playlistSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(playlistSongs[currentIndex - 1]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar setView={handleSetView} activeView={currentView === 'dashboard' || currentView === 'import' ? currentView : activePlaylistId} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentView === 'dashboard' && <Dashboard setView={handleSetView} />}
          {currentView === 'playlist' && activePlaylistId && <PlaylistView playlistId={activePlaylistId} onSongSelect={setCurrentSong} />}
          {currentView === 'import' && <ImportView />}
        </div>
        {currentSong && (
          <MusicPlayer 
            song={currentSong} 
            onNext={handlePlayNext}
            onPrev={handlePlayPrev}
            hasNext={playlistSongs.findIndex(s => s.id === currentSong.id) < playlistSongs.length - 1}
            hasPrev={playlistSongs.findIndex(s => s.id === currentSong.id) > 0}
            updateSongLevel={updateSongLevel}
          />
        )}
      </main>
    </div>
  );
};

export default App;
