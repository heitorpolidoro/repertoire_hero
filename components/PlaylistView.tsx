import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { Song } from '../types';
import { PRACTICE_LEVELS, getLevelDetails, LEVEL_HOVER_CLASSES } from '../constants';
import { formatDuration, formatTotalDuration } from '../lib/utils';

// LevelIndicator Component
const LevelIndicator: React.FC<{ level: number; large?: boolean }> = ({ level, large = false }) => {
  const details = getLevelDetails(level);
  return (
    <span
      title={details.title}
      className={`flex items-center justify-center rounded-full font-bold
        ${details.bgColor} ${details.color}
        ${large ? 'w-8 h-8 text-base' : 'w-6 h-6 text-xs'}`}
    >
      {level}
    </span>
  );
};

// SongItem Component
const SongItem: React.FC<{ song: Song; onSelect: (song: Song) => void; isPlaying: boolean }> = ({ song, onSelect, isPlaying }) => {
  const { updateSongLevel } = useAppContext();

  return (
    <div 
      className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${isPlaying ? 'bg-indigo-600/30' : 'hover:bg-gray-800'}`}
      onClick={() => onSelect(song)}
    >
      <img src={song.albumArtUrl} alt={song.album} className="w-12 h-12 rounded-md mr-4" />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isPlaying ? 'text-indigo-400' : 'text-white'}`}>{song.title}</p>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
      </div>
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="flex space-x-1">
          {PRACTICE_LEVELS.map(levelInfo => (
            <button
              key={levelInfo.level}
              onClick={(e) => {
                e.stopPropagation(); // Prevent song selection when changing level
                updateSongLevel(song.id, levelInfo.level);
              }}
              title={levelInfo.title}
              className={`w-6 h-6 rounded-full transition-transform duration-150 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${song.level === levelInfo.level ? `${levelInfo.bgColor} ring-2 ring-white` : `bg-gray-600 ${LEVEL_HOVER_CLASSES[levelInfo.level]}`}`}
            >
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-400 font-mono w-12 text-right">{formatDuration(song.duration)}</span>
        <LevelIndicator level={song.level} />
      </div>
    </div>
  );
};

// PlaylistView Component
const PlaylistView: React.FC<{ playlistId: string; }> = ({ playlistId }) => {
  const { playlists, songs, setCurrentSong, currentSong } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const playlist = playlists.find(p => p.id === playlistId);

  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    return songs.filter(song => playlist.songIds.includes(song.id));
  }, [songs, playlist]);
  
  const totalDuration = useMemo(() => {
    return playlistSongs.reduce((acc, song) => acc + song.duration, 0);
  }, [playlistSongs]);

  const filteredSongs = useMemo(() => {
    if (activeFilter === null) return playlistSongs;
    return playlistSongs.filter(song => song.level === activeFilter);
  }, [activeFilter, playlistSongs]);

  if (!playlist) {
    return <div className="text-center text-red-500">Playlist not found!</div>;
  }
  
  const handleSelectAndPlay = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline space-x-4">
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-gray-400">{`${playlistSongs.length} songs, ${formatTotalDuration(totalDuration)}`}</p>
        </div>
        <p className="text-gray-400 mt-1">{playlist.description}</p>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeFilter === null ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          All
        </button>
        {PRACTICE_LEVELS.map(levelInfo => (
          <button
            key={levelInfo.level}
            onClick={() => setActiveFilter(levelInfo.level)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex-shrink-0 flex items-center ${activeFilter === levelInfo.level ? `${levelInfo.bgColor} ${levelInfo.color}` : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {levelInfo.icon} {levelInfo.title}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredSongs.length > 0 ? (
          filteredSongs.map(song => <SongItem key={song.id} song={song} onSelect={handleSelectAndPlay} isPlaying={currentSong?.id === song.id} />)
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No songs match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
