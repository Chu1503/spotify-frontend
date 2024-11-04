import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function Playlists({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 20,
            },
          }
        );
        setPlaylists(response.data.items);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to fetch playlists.");
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Your Playlists
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="w-48">
            <div
              className="relative w-48 h-48 cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              {playlist.images && playlist.images.length > 0 ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-48 h-48 object-cover transition-opacity duration-200 ease-in-out hover:opacity-75"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-400 flex items-center justify-center text-gray-700">
                  No Image
                </div>
              )}
              {/* Overlay for darkening effect */}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-opacity duration-200"></div>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3
                className="text-md font-semibold text-white text-center hover:underline cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                {playlist.name}
              </h3>
              <p className="text-xs text-[#9b9b9b] text-center">
                {playlist.tracks.total} TRACKS
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;