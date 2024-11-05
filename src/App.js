// App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Components and Pages
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import TopArtists from "./pages/TopArtists";
import TopTracks from "./pages/TopTracks";
import Recent from "./pages/Recent";
import Playlists from "./pages/Playlists";
import Recommendations from "./pages/Recommendations";
import PlaylistDetail from "./pages/PlaylistDetail";
import SongDetail from "./pages/SongDetail";
import ArtistDetail from "./pages/ArtistDetail";
import PlayRec from "./pages/PlayRec";
import SongRec from "./pages/SongRec";
import ArtRec from "./pages/ArtRec";

function App() {
  const [user, setUser] = useState(null);
  const [playlistsCount, setPlaylistsCount] = useState(0);

  // Fetch user profile and playlists data
  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("Fetching user profile...");
        const profileResponse = await fetch(
          "https://spotify-backend-omega.vercel.app/api/me"
        );
        const profileData = await profileResponse.json();
        setUser(profileData);
        console.log("User Profile Data:", profileData);

        console.log("Fetching user playlists...");
        const playlistsResponse = await fetch(
          "https://spotify-backend-omega.vercel.app/api/me/playlists"
        );
        const playlistsData = await playlistsResponse.json();
        setPlaylistsCount(playlistsData.total);
        console.log("Playlists Data:", playlistsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
        <a
          href="https://spotify-backend-omega.vercel.app/login"
          className="px-6 py-3 bg-[#1ed760] rounded-full font-bold hover:bg-[#1ED760] transition duration-300"
        >
          LOGIN WITH SPOTIFY
        </a>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#181818]">
        <Sidebar user={user} handleLogout={() => setUser(null)} />

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route
              path="/profile"
              element={<Profile user={user} playlistsCount={playlistsCount} />}
            />
            <Route path="/top-artists" element={<TopArtists />} />
            <Route path="/top-tracks" element={<TopTracks />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
            <Route path="/song/:songId" element={<SongDetail />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
            <Route path="/playrec/:id" element={<PlayRec />} />
            <Route path="/songrec/:trackId" element={<SongRec />} />
            <Route path="/artrec/:artistId" element={<ArtRec />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
