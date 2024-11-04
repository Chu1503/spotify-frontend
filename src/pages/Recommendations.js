import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlaylistModal from "../components/PlaylistModal";

function Recommendations({ token }) {
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [isSearching, setIsSearching] = useState(false); // State to manage search loading
  const navigate = useNavigate();

  const handlePlaylistSelect = (playlistId) => {
    setModalOpen(false); // Close the modal after selection
    navigate(`/playrec/${playlistId}`); // Navigate to PlayRec with selected playlist
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: searchQuery,
            type: "track",
            limit: 5,
          },
        });
        setSearchResults(response.data.tracks.items); // Set search results
      } catch (err) {
        console.error("Error searching for track:", err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleTrackSelect = (trackId) => {
    navigate(`/playrec/${trackId}`); // Navigate to PlayRec with selected track
  };

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Recommendations</h2>
      
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Based on Playlist</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-[#1ED760] rounded-full font-bold hover:bg-[#1ED760] transition duration-300"
        >
          Choose Playlist
        </button>

        {/* Search Bar for Songs */}
        <div className="w-full max-w-md mt-8">
          <input
            type="text"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            className="w-full p-2 rounded border border-gray-400 text-black"
          />
          {isSearching && <p className="text-white mt-2">Searching...</p>}

          {/* Display search results */}
          {searchResults.length > 0 && (
            <ul className="bg-[#282828] rounded-md mt-2 p-2 max-h-60 overflow-y-auto">
              {searchResults.map((track) => (
                <li
                  key={track.id}
                  onClick={() => handleTrackSelect(track.id)}
                  className="p-2 hover:bg-[#3e3e3e] cursor-pointer rounded text-white flex items-center"
                >
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <p className="font-bold">{track.name}</p>
                    <p className="text-sm text-gray-400">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Playlist Modal */}
        {modalOpen && (
          <PlaylistModal
            token={token}
            onSelect={handlePlaylistSelect}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Recommendations;