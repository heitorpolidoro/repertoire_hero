
import type { User, Song, Playlist } from '../types';

export const mockUser: User = {
  name: 'Alex Turner',
  avatarUrl: 'https://picsum.photos/seed/repertoirehero/100/100',
  title: 'Lead Guitarist',
};

export const mockSongs: Song[] = [
  { id: 's1', title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration: 482, albumArtUrl: 'https://picsum.photos/seed/s1/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=QkF3oxziUI4', spotifyUrl: 'https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc', level: 5 },
  { id: 's2', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 355, albumArtUrl: 'https://picsum.photos/seed/s2/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', spotifyUrl: 'https://open.spotify.com/track/4u7EnebtmKWzANvKgiJGEF', level: 4 },
  { id: 's3', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: 391, albumArtUrl: 'https://picsum.photos/seed/s3/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=09839DpTctU', spotifyUrl: 'https://open.spotify.com/track/40riOy7x9W7GXjyGp4pjAv', level: 3 },
  { id: 's4', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration: 301, albumArtUrl: 'https://picsum.photos/seed/s4/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg', spotifyUrl: 'https://open.spotify.com/track/5ghIJDpPoe3CfHMGu71E6T', level: 5 },
  { id: 's5', title: 'Wonderwall', artist: 'Oasis', album: '(What\'s the Story) Morning Glory?', duration: 258, albumArtUrl: 'https://picsum.photos/seed/s5/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=6hzrDeceEKc', spotifyUrl: 'https://open.spotify.com/track/2GO2uYvR4pizsLzM2oO4aB', level: 2 },
  { id: 's6', title: 'Back in Black', artist: 'AC/DC', album: 'Back in Black', duration: 255, albumArtUrl: 'https://picsum.photos/seed/s6/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=pAgnJDJN4VA', spotifyUrl: 'https://open.spotify.com/track/08mG3Y1vljYA6bvDt4Wqkj', level: 1 },
  { id: 's7', title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration: 294, albumArtUrl: 'https://picsum.photos/seed/s7/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y', spotifyUrl: 'https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5', level: 0 },
  { id: 's8', title: 'Hey Jude', artist: 'The Beatles', album: 'The Beatles (White Album)', duration: 431, albumArtUrl: 'https://picsum.photos/seed/s8/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=A_MjCqQoLLA', spotifyUrl: 'https://open.spotify.com/track/0aym2LB2i7gwn5UuKz6dxJ', level: 3 },
  { id: 's9', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration: 356, albumArtUrl: 'https://picsum.photos/seed/s9/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=1w7OgIMMRc4', spotifyUrl: 'https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51', level: 4 },
  { id: 's10', title: 'Hallelujah', artist: 'Leonard Cohen', album: 'Various Positions', duration: 279, albumArtUrl: 'https://picsum.photos/seed/s10/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=YrLk4vdY28Q', spotifyUrl: 'https://open.spotify.com/track/3pRaLNL3b8x5uBOcsgvdqM', level: 1 },
  { id: 's11', title: 'No Woman, No Cry', artist: 'Bob Marley & The Wailers', album: 'Natty Dread', duration: 429, albumArtUrl: 'https://picsum.photos/seed/s11/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=ITs-9eTZyA8', spotifyUrl: 'https://open.spotify.com/track/4PXaSPVwBE8uS_pLh42e8k', level: 2 },
  { id: 's12', title: 'Creep', artist: 'Radiohead', album: 'Pablo Honey', duration: 238, albumArtUrl: 'https://picsum.photos/seed/s12/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=XFkzRNyygfk', spotifyUrl: 'https://open.spotify.com/track/6b2oQwSGFkzsMtQruIWm2p', level: 0 },
  { id: 's13', title: 'Take Me Home, Country Roads', artist: 'John Denver', album: 'Poems, Prayers & Promises', duration: 188, albumArtUrl: 'https://picsum.photos/seed/s13/400/400', youtubeUrl: 'https://www.youtube.com/watch?v=1vrEljMfXYo', spotifyUrl: 'https://open.spotify.com/track/1YYhDizHx7PnDhAhko6cDS', level: 4 },
];

export const mockPlaylists: Playlist[] = [
  { id: 'p1', name: 'Acoustic Set', description: 'Easy songs for the acoustic guitar.', source: 'user', songIds: ['s5', 's10', 's11', 's12', 's13'] },
  { id: 'p2', name: 'Rock Classics', description: 'Must-know rock anthems.', source: 'user', songIds: ['s1', 's2', 's3', 's4', 's6', 's9'] },
  { id: 'p3', name: 'All Songs', description: 'My entire repertoire.', source: 'user', songIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13'] },
];

export const mockImportablePlaylists = {
  spotify: [
    { id: 'sp1', name: '80s Rock Anthems', description: 'From Spotify', source: 'spotify', songIds: ['s6', 's9'] },
    { id: 'sp2', name: 'Coffee Shop Vibes', description: 'From Spotify', source: 'spotify', songIds: ['s5', 's10'] }
  ],
  youtube: [
    { id: 'yt1', name: 'Classic Rock Solos', description: 'From YouTube', source: 'youtube', songIds: ['s1', 's3'] },
    { id: 'yt2', name: '90s Alternative Hits', description: 'From YouTube', source: 'youtube', songIds: ['s4', 's5', 's12'] }
  ]
};
