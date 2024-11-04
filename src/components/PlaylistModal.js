import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

function PlaylistModal({ token, onSelect, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to fetch playlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#282828] p-6 rounded-lg w-[80%] max-w-lg text-white relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Select a Playlist</h2>
        
        {loading ? (
          <div className="flex items-center justify-center">
            <ClipLoader color="#1ED760" size={50} />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto pr-4" style={{ scrollbarWidth: 'none' }}>
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                onClick={() => onSelect(playlist.id)}
                className="flex items-center p-2 hover:bg-[#3e3e3e] cursor-pointer rounded"
              >
                {/* Display playlist image or a placeholder */}
                {playlist.images && playlist.images.length > 0 ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-10 h-10 rounded-md mr-4"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-500 mr-4 flex items-center justify-center text-gray-700">
                    🎵
                  </div>
                )}
                <p className="text-left">{playlist.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PlaylistModal;