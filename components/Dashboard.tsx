"use client";

import React from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../hooks/useAppContext';
import { PRACTICE_LEVELS, getLevelDetails } from '../constants';
import type { Song } from '../types';

const Dashboard: React.FC = () => {
    const { songs, playlists } = useAppContext();

    const songsByLevel = PRACTICE_LEVELS.map(levelInfo => ({
        name: levelInfo.title,
        count: songs.filter(song => song.level === levelInfo.level).length,
        color: levelInfo.color.replace('text-', '').replace('-400', '')
    }));

    // Recharts colors are direct hex/rgb values, so we map tailwind colors to something usable.
    const colorMap: { [key: string]: string } = {
        gray: '#9CA3AF',
        red: '#F87171',
        orange: '#FB923C',
        yellow: '#FBBF24',
        lime: '#A3E635',
        green: '#4ADE80'
    };

    const practiceSuggestions = songs.filter(song => song.level <= 1).slice(0, 5);

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg">
            <div className="p-3 bg-indigo-600 rounded-lg mr-4">{icon}</div>
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-gray-400">{title}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Songs" value={songs.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>} />
                <StatCard title="Playlists" value={playlists.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>} />
                <StatCard title="Mastered Songs" value={songs.filter(s => s.level === 5).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Songs by Level</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={songsByLevel} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                <XAxis dataKey="name" tick={{ fill: '#D1D5DB' }} />
                                <YAxis allowDecimals={false} tick={{ fill: '#D1D5DB' }} />
                                <Tooltip cursor={{fill: 'rgba(107, 114, 128, 0.3)'}} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}/>
                                <Bar dataKey="count" fill="#818CF8">
                                    {songsByLevel.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#818CF8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Practice Suggestions</h2>
                    {practiceSuggestions.length > 0 ? (
                        <ul className="space-y-3">
                            {practiceSuggestions.map((song: Song) => {
                                const levelDetails = getLevelDetails(song.level);
                                const playlist = playlists.find(p => p.songIds.includes(song.id));
                                return (
                                    <li key={song.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{song.title}</p>
                                            <p className="text-sm text-gray-400">{song.artist}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span
                                                title={levelDetails.title}
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${levelDetails.bgColor} ${levelDetails.color}`}
                                            >
                                                {levelDetails.icon} {levelDetails.title}
                                            </span>
                                            {playlist && 
                                              <Link
                                                href={`/playlist/${playlist.id}`}
                                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-colors"
                                              >
                                                  Go to Playlist
                                              </Link>
                                            }
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No new songs to practice. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;