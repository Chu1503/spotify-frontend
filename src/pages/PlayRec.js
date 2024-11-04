import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";

function PlayRec({ token }) {
  const { id } = useParams(); // playlist ID
  const [playlistName, setPlaylistName] = useState(""); // State to store the original playlist name
  const [customPlaylistName, setCustomPlaylistName] = useState(""); // State for custom playlist name
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false); // State to manage save button loading
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isPublic, setIsPublic] = useState(true); // State for playlist visibility
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation message

  useEffect(() => {
    const fetchPlaylistName = async () => {
      try {
        const playlistDetails = await axios.get(
          `https://api.spotify.com/v1/playlists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlaylistName(playlistDetails.data.name);
      } catch (err) {
        console.error("Error fetching playlist name:", err);
      }
    };

    const fetchSeedTracksAndRecommendations = async () => {
      try {
        // Fetch a few tracks from the playlist
        const playlistResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 5,
            },
          }
        );

        const trackIds = playlistResponse.data.items
          .map((item) => item.track.id)
          .slice(0, 5); // Limit to 5 track IDs for seeding

        // Fetch recommendations based on these track IDs
        const recommendationsResponse = await axios.get(
          `https://api.spotify.com/v1/recommendations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              seed_tracks: trackIds.join(","),
              limit: 20,
            },
          }
        );

        setRecommendations(recommendationsResponse.data.tracks);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to fetch recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistName(); // Fetch the playlist name first
    fetchSeedTracksAndRecommendations(); // Fetch recommendations
  }, [id, token]);

  const openModal = () => {
    setShowModal(true);
  };

  const saveToSpotify = async () => {
    if (recommendations.length === 0 || !customPlaylistName.trim()) {
      alert("Please enter a name for the playlist.");
      return;
    }

    setSaving(true); // Start save loading
    try {
      // Step 1: Create a new playlist
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;
      const newPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: customPlaylistName,
          description: `A playlist of recommendations based on ${playlistName}.`,
          public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newPlaylistId = newPlaylistResponse.data.id;

      // Step 2: Add recommended tracks to the new playlist
      const trackUris = recommendations.map((track) => track.uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show confirmation message and close modal
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
      setShowModal(false);
    } catch (err) {
      console.error("Error saving playlist to Spotify:", err);
      alert("Failed to save playlist. Please try again.");
    } finally {
      setSaving(false); // End save loading
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Recommended Tracks based on <span className="text-[#1ED760]">{playlistName}</span>
        </h2>
        <button
          onClick={openModal}
          disabled={saving}
          className={`px-4 py-2 bg-[#1ED760] text-xs mr-24 text-white rounded-full font-bold hover:bg-[#1db954] transition duration-300 ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Saving..." : "Save to Spotify"}
        </button>
      </div>

      {/* Confirmation message */}
      {showConfirmation && (
        <div className="text-center bg-[#1ED760] text-[#040306] p-2 rounded mb-4">
          Playlist saved to your Spotify account!
        </div>
      )}

      <ul>
        {recommendations.map((track, index) => (
          <SongItem key={track.id} track={track} index={index} />
        ))}
      </ul>

      {/* Modal for playlist name and privacy selection */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-[80%] max-w-md text-white relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-2xl">
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Save Playlist to Spotify</h2>
            <input
              type="text"
              placeholder="Enter Playlist Name"
              value={customPlaylistName}
              onChange={(e) => setCustomPlaylistName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 text-white mb-4 bg-[#040306]"
            />
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => setIsPublic(true)}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  isPublic ? "bg-[#1ED760] text-white" : "bg-[#040306] text-white"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  !isPublic ? "bg-[#1ED760] text-white" : "bg-[#040306] text-white"
                }`}
              >
                Private
              </button>
            </div>
            <button
              onClick={saveToSpotify}
              disabled={saving}
              className="px-4 py-2 bg-[#1ED760] text-white rounded-full font-bold hover:bg-[#1db954] transition duration-300 w-full"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayRec;