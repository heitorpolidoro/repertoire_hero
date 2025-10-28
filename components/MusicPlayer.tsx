import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { FaStepBackward, FaStepForward, FaSpotify, FaYoutube } from 'react-icons/fa';
import { PRACTICE_LEVELS, LEVEL_HOVER_CLASSES } from '../constants';

interface MusicPlayerProps {
  song: Song;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  updateSongLevel: (songId: string, level: number) => void;
}

const getSpotifyEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
        return `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator&theme=0`;
    }
    return null;
};

const getYoutubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    // Handles standard youtube.com/watch?v=... and shortened youtu.be/... URLs
    const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        // Adding `origin` is a security best practice and helps prevent "configuration error" issues with YouTube embeds.
        const origin = window.location.origin;
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&origin=${encodeURIComponent(origin)}`;
    }
    return null;
};


const MusicPlayer: React.FC<MusicPlayerProps> = ({ song, onNext, onPrev, hasNext, hasPrev, updateSongLevel }) => {
  const [activePlayer, setActivePlayer] = useState<'spotify' | 'youtube' | null>(null);

  const spotifyEmbedUrl = getSpotifyEmbedUrl(song.spotifyUrl);
  const youtubeEmbedUrl = getYoutubeEmbedUrl(song.youtubeUrl);

  useEffect(() => {
    // Set a default player when the song changes
    if (spotifyEmbedUrl) {
      setActivePlayer('spotify');
    } else if (youtubeEmbedUrl) {
      setActivePlayer('youtube');
    } else {
      setActivePlayer(null);
    }
  }, [song, spotifyEmbedUrl, youtubeEmbedUrl]);


  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-4 border-t border-gray-700 shadow-2xl flex items-center justify-between space-x-6">
      {/* Left: Song Info */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img src={song.albumArtUrl} alt={song.album} className="w-16 h-16 rounded-md shadow-lg flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-white truncate">{song.title}</p>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          <div className="flex space-x-1.5 mt-2">
            {PRACTICE_LEVELS.map(levelInfo => (
                <button
                    key={levelInfo.level}
                    onClick={() => updateSongLevel(song.id, levelInfo.level)}
                    title={levelInfo.title}
                    className={`w-5 h-5 rounded-full transition-transform duration-150 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${song.level === levelInfo.level ? `${levelInfo.bgColor} ring-2 ring-white` : `bg-gray-600 ${LEVEL_HOVER_CLASSES[levelInfo.level]}`}`}
                >
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: Controls & Toggles */}
      <div className="flex-shrink-0 flex items-center space-x-4 text-white">
        <button onClick={onPrev} disabled={!hasPrev} className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FaStepBackward size={20} />
        </button>
        <div className="flex items-center space-x-2">
            {spotifyEmbedUrl && (
                <button 
                    onClick={() => setActivePlayer('spotify')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-colors ${activePlayer === 'spotify' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    <FaSpotify />
                    <span>Spotify</span>
                </button>
            )}
            {youtubeEmbedUrl && (
                <button 
                    onClick={() => setActivePlayer('youtube')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-colors ${activePlayer === 'youtube' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    <FaYoutube />
                    <span>YouTube</span>
                </button>
            )}
        </div>
        <button onClick={onNext} disabled={!hasNext} className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FaStepForward size={20} />
        </button>
      </div>

      {/* Right: Embedded Player */}
      <div className="flex-1 h-20" style={{minWidth: 300, maxWidth: 400}}>
          {activePlayer === 'spotify' && spotifyEmbedUrl && (
              <iframe
                key={song.id + '-spotify'} // Key forces re-render on song change
                style={{ borderRadius: '12px' }}
                src={spotifyEmbedUrl}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
              ></iframe>
          )}
          {activePlayer === 'youtube' && youtubeEmbedUrl && (
              <iframe
                key={song.id + '-youtube'}
                width="100%"
                height="80"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          )}
          {!activePlayer && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-md">
                  <p className="text-gray-500 text-sm">No embeddable player available</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default MusicPlayer;