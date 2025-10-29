
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import type { User, Song, Playlist } from '../types';
import { apiFetch } from '../utils/api';

interface AppContextType {
  user: User | null;
  songs: Song[];
  playlists: Playlist[];
  updateSongLevel: (songId: string, level: number) => void;
  addPlaylist: (playlist: Playlist) => void;
  loginWithGoogle: (credential: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'rh.user';

function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Failed to decode JWT', e);
    return null;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    // Restore session from localStorage
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Backward compatibility: ensure title
        if (!parsed.title) parsed.title = 'Musician';
        setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Fetch mock data from dev backend endpoints instead of importing locally
    const fetchData = async () => {
      try {
        const [songsRes, playlistsRes] = await Promise.all([
          apiFetch('/api/songs', { user }),
          apiFetch('/api/playlists', { user })
        ]);
        if (songsRes.ok) {
          const data = await songsRes.json();
          if (Array.isArray(data)) {
            // backward compatibility if server returned array directly
            setSongs(data as Song[]);
          } else if (Array.isArray(data.songs)) {
            setSongs(data.songs as Song[]);
          }
        }
        if (playlistsRes.ok) {
          const data = await playlistsRes.json();
          if (Array.isArray(data)) {
            setPlaylists(data as Playlist[]);
          } else if (Array.isArray(data.playlists)) {
            setPlaylists(data.playlists as Playlist[]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch initial data', e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  const loginWithGoogle = (credential: string) => {
    const payload = decodeJwtPayload<{ name?: string; picture?: string; email?: string }>(credential);
    if (payload) {
      const u: User = {
        name: payload.name || payload.email || 'User',
        avatarUrl: payload.picture || 'https://www.gravatar.com/avatar/?d=mp',
        title: 'Musician',
      };
      setUser(u);
    }
  };

  const logout = () => setUser(null);

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
    loginWithGoogle,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
