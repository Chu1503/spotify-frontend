// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import PlayRec from "./pages/PlayRec"; // Import the PlayRec component

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlistsCount, setPlaylistsCount] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      const params = new URLSearchParams(hash.substring(1));
      token = params.get("access_token");

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      axios
        .get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPlaylistsCount(response.data.total);
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error);
        });
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setPlaylistsCount(0);
    window.localStorage.removeItem("token");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
        <a
          href="http://localhost:5000/login"
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
        <Sidebar user={user} handleLogout={handleLogout} />

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route
              path="/profile"
              element={<Profile user={user} playlistsCount={playlistsCount} />}
            />
            <Route
              path="/top-artists"
              element={<TopArtists token={token} />}
            />
            <Route
              path="/top-tracks"
              element={<TopTracks token={token} />}
            />
            <Route
              path="/recent"
              element={<Recent token={token} />}
            />
            <Route
              path="/playlists"
              element={<Playlists token={token} />}
            />
            <Route
              path="/recommendations"
              element={<Recommendations token={token} />}
            />
            <Route
              path="/playlist/:id"
              element={<PlaylistDetail token={token} />}
            />
            <Route
              path="/song/:songId"
              element={<SongDetail token={token} />}
            />
            <Route
              path="/artist/:id"
              element={<ArtistDetail token={token} />}
            />
            <Route
              path="/playrec/:id" // Recommendations page route
              element={<PlayRec token={token} />}
            />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
