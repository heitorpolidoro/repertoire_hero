
import React, { createContext, useState, ReactNode } from 'react';
import type { User, Song, Playlist } from '../types';
import { mockUser, mockSongs, mockPlaylists } from '../data/mockData';

interface AppContextType {
  user: User | null;
  songs: Song[];
  playlists: Playlist[];
  updateSongLevel: (songId: string, level: number) => void;
  addPlaylist: (playlist: Playlist) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User | null>(mockUser);
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);

  const updateSongLevel = (songId: string, level: number) => {
    setSongs(prevSongs =>
      prevSongs.map(song =>
        song.id === songId ? { ...song, level } : song
      )
    );
  };

  const addPlaylist = (playlist: Playlist) => {
    if (!playlists.some(p => p.id === playlist.id)) {
      setPlaylists(prevPlaylists => [...prevPlaylists, playlist]);
    }
  };

  const value = {
    user,
    songs,
    playlists,
    updateSongLevel,
    addPlaylist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
