import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import PlaylistSplitter from "./pages/PlaylistSplitter";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlistsCount, setPlaylistsCount] = useState(0);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setPlaylistsCount(0);
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
    console.log("User logged out.");
  };

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = window.localStorage.getItem("refresh_token");
    if (!refreshToken) {
      handleLogout();
      return;
    }
    try {
      const response = await fetch(
        `https://spotify-backend-omega.vercel.app/refresh_token?refresh_token=${refreshToken}`
        // `http://localhost:5000/refresh_token?refresh_token=${refreshToken}`
      );
      const data = await response.json();
      if (response.ok) {
        const newAccessToken = data.access_token;
        window.localStorage.setItem("access_token", newAccessToken);
        setToken(newAccessToken);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    let storedToken = window.localStorage.getItem("access_token");

    if (!storedToken && hash) {
      const params = new URLSearchParams(hash.substring(1));
      storedToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      window.location.hash = ""; // Clear the hash

      if (storedToken && refreshToken) {
        window.localStorage.setItem("access_token", storedToken);
        window.localStorage.setItem("refresh_token", refreshToken);
      }
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser(profileData);
        } else if (profileResponse.status === 401) {
          await refreshAccessToken();
        } else {
          handleLogout();
        }

        const playlistResponse = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (playlistResponse.ok) {
          const playlistData = await playlistResponse.json();
          setPlaylistsCount(playlistData.total);
        } else if (playlistResponse.status === 401) {
          await refreshAccessToken();
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    };

    fetchUserData();
  }, [token, refreshAccessToken]);

  useEffect(() => {
    if (!token) return;
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 1000 * 60 * 45);
    return () => clearInterval(refreshInterval);
  }, [token, refreshAccessToken]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
        <a
          // href="https://spotify-backend-omega.vercel.app/login"
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
            <Route path="/top-artists" element={<TopArtists token={token} />} />
            <Route path="/top-tracks" element={<TopTracks token={token} />} />
            <Route path="/recent" element={<Recent token={token} />} />
            <Route path="/playlists" element={<Playlists token={token} />} />
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
            <Route path="/playrec/:id" element={<PlayRec token={token} />} />
            <Route
              path="/songrec/:trackId"
              element={<SongRec token={token} />}
            />
            <Route
              path="/artrec/:artistId"
              element={<ArtRec token={token} />}
            />
            <Route
              path="/playlist-splitter/:playlistId"
              element={<PlaylistSplitter token={token} />}
            />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
