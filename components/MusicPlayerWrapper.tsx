"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../hooks/useAppContext';
import MusicPlayer from './MusicPlayer';
import type { Song } from '../types';

const MusicPlayerWrapper: React.FC = () => {
    const { songs, playlists, currentSong, setCurrentSong, updateSongLevel } = useAppContext();
    const pathname = usePathname();

    const activePlaylistId = pathname.startsWith('/playlist/') ? pathname.split('/')[2] : null;

    const currentPlaylist = playlists.find(p => p.id === activePlaylistId);
    const playlistSongs = currentPlaylist ? songs.filter(song => currentPlaylist.songIds.includes(song.id)) : [];

    useEffect(() => {
        if (currentSong) {
            const updatedSongFromContext = songs.find(s => s.id === currentSong.id);
            if (updatedSongFromContext && JSON.stringify(updatedSongFromContext) !== JSON.stringify(currentSong)) {
                setCurrentSong(updatedSongFromContext);
            }
        }
    }, [songs, currentSong, setCurrentSong]);

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

    if (!currentSong) {
        return null;
    }

    return (
        <MusicPlayer
            song={currentSong}
            onNext={handlePlayNext}
            onPrev={handlePlayPrev}
            hasNext={currentPlaylist ? playlistSongs.findIndex(s => s.id === currentSong.id) < playlistSongs.length - 1 : false}
            hasPrev={currentPlaylist ? playlistSongs.findIndex(s => s.id === currentSong.id) > 0 : false}
            updateSongLevel={updateSongLevel}
        />
    );
};

export default MusicPlayerWrapper;
