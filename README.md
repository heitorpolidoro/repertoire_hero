<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16Is86HTVyaWDn1MoTxmPGgJP3LSPgc25

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file in the project root with your credentials:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
   ```
   - Create a Web application credential in Google Cloud Console.
   - Add authorized JavaScript origins for local dev (e.g., `http://localhost:3000`).
3. Run the app:
   `npm run dev`

## Dev Mock Backend (API)
During development, a small mock API is served by the Vite dev server so that all mock data comes from real HTTP requests.

- Base URL: `http://localhost:3000`
- Endpoints:
  - `GET /api/songs` → `{ songs: Song[] }`
  - `GET /api/playlists` → `{ playlists: Playlist[] }`
  - `GET /api/importable-playlists` → `{ spotify: Playlist[], youtube: Playlist[] }`

The frontend fetches these endpoints on load instead of importing local mocks.
These endpoints exist only in dev (via a Vite middleware plugin) and are not included in production builds.

## Google Login
- We use Google Identity Services (One Tap/Sign In button).
- The script is loaded in `index.html`.
- The login button appears in the sidebar when you are signed out. On success, your basic profile (name, avatar) is stored locally to persist the session.
- To sign out, click the Logout button in the sidebar.
