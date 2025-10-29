
import React, { useEffect, useState } from 'react';
import { FaSpotify, FaYoutube, FaCheck } from 'react-icons/fa';
import { useAppContext } from '../hooks/useAppContext';
import type { Playlist } from '../types';
import { apiFetch } from '../utils/api';

const ImportView: React.FC = () => {
    const { addPlaylist, playlists, user } = useAppContext();
    const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
    const [spotifyLists, setSpotifyLists] = useState<Playlist[]>([]);
    const [youtubeLists, setYoutubeLists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiFetch('/api/importable-playlists', { user });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data?.spotify)) setSpotifyLists(data.spotify as Playlist[]);
                    if (Array.isArray(data?.youtube)) setYoutubeLists(data.youtube as Playlist[]);
                }
            } catch (e) {
                console.error('Failed to fetch importable playlists', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleImport = (playlist: Playlist) => {
        addPlaylist(playlist);
        setImportedIds(prev => new Set(prev).add(playlist.id));
    };

    const isImported = (playlistId: string) => importedIds.has(playlistId) || playlists.some(p => p.id === playlistId);

    const PlaylistCard: React.FC<{ playlist: Playlist, platform: 'spotify' | 'youtube' }> = ({ playlist, platform }) => {
        const platformStyles = {
            spotify: {
                icon: <FaSpotify className="text-green-500" />,
                buttonBg: 'bg-green-600 hover:bg-green-700',
            },
            youtube: {
                icon: <FaYoutube className="text-red-500" />,
                buttonBg: 'bg-red-600 hover:bg-red-700',
            }
        };

        const styles = platformStyles[platform];

        return (
            <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md">
                <div className="flex items-center">
                    <div className="text-2xl mr-4">{styles.icon}</div>
                    <div>
                        <p className="font-semibold">{playlist.name}</p>
                        <p className="text-sm text-gray-400">{playlist.description}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleImport(playlist)}
                    disabled={isImported(playlist.id)}
                    className={`px-4 py-2 text-sm font-bold text-white rounded-full transition-colors flex items-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed ${styles.buttonBg}`}
                >
                    {isImported(playlist.id) ? (
                        <>
                            <FaCheck />
                            <span>Imported</span>
                        </>
                    ) : (
                        <span>Import</span>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">Import Playlists</h1>
            <p className="text-gray-400">
                This is a simulation. Click "Import" to add pre-defined playlists from Spotify or YouTube to your collection.
            </p>

            {loading ? (
                <p className="text-gray-400">Loading available playlists...</p>
            ) : (
                <>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center"><FaSpotify className="mr-3 text-green-500" /> From Spotify</h2>
                        <div className="space-y-3">
                            {spotifyLists.map(p => <PlaylistCard key={p.id} playlist={p as Playlist} platform="spotify" />)}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center"><FaYoutube className="mr-3 text-red-500" /> From YouTube</h2>
                        <div className="space-y-3">
                            {youtubeLists.map(p => <PlaylistCard key={p.id} playlist={p as Playlist} platform="youtube" />)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImportView;
