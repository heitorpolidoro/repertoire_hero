import type { ReactNode } from 'react';

export interface User {
  name: string;
  avatarUrl: string;
  title: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  albumArtUrl: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  level: number; // 0-5
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  source: 'user' | 'spotify' | 'youtube';
  songIds: string[];
}

export interface PracticeLevel {
  level: number;
  title: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
}
