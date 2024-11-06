import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";
import { Bar } from "react-chartjs-2";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PlaylistDetail({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlaylist(response.data);
        setNewPlaylistName(response.data.name); // Set initial name for editing
        fetchAudioFeatures(
          response.data.tracks.items.map((item) => item.track.id)
        );
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError("Failed to fetch playlist details.");
        setLoading(false);
      }
    };

    const fetchAudioFeatures = async (trackIds) => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const features = response.data.audio_features;
        calculateAverageFeatures(features);
      } catch (err) {
        console.error("Error fetching audio features:", err);
        setError("Failed to fetch audio features.");
      }
      setLoading(false);
    };

    const calculateAverageFeatures = (features) => {
      const featureNames = [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "liveness",
        "speechiness",
        "valence",
      ];
      const averages = featureNames.reduce((acc, feature) => {
        const total = features.reduce((sum, track) => sum + track[feature], 0);
        acc[feature] = total / features.length;
        return acc;
      }, {});
      setAudioFeatures(averages);
    };

    fetchPlaylist();
  }, [id, token]);

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDeletePlaylist = async () => {
    try {
      await axios.delete(
        `https://api.spotify.com/v1/playlists/${id}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/playlists");
    } catch (err) {
      console.error("Error deleting playlist:", err);
      alert("Failed to delete playlist. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const savePlaylistName = async () => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/playlists/${id}`,
        { name: newPlaylistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlaylist((prev) => ({ ...prev, name: newPlaylistName }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating playlist name:", err);
      alert("Failed to update playlist name. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  const data = audioFeatures
    ? {
        labels: Object.keys(audioFeatures),
        datasets: [
          {
            label: "Average Value",
            data: Object.values(audioFeatures),
            backgroundColor: [
              "rgba(231, 76, 60, 0.7)", // Vibrant Red
              "rgba(52, 152, 219, 0.7)", // Cool Blue
              "rgba(46, 204, 113, 0.7)", // Fresh Green
              "rgba(155, 89, 182, 0.7)", // Deep Purple
              "rgba(241, 196, 15, 0.7)", // Warm Yellow
              "rgba(26, 188, 156, 0.7)", // Aqua Teal
              "rgba(230, 126, 34, 0.7)", // Rich Orange
            ],
            borderColor: [
              "rgba(231, 76, 60, 1)", // Vibrant Red
              "rgba(52, 152, 219, 1)", // Cool Blue
              "rgba(46, 204, 113, 1)", // Fresh Green
              "rgba(155, 89, 182, 1)", // Deep Purple
              "rgba(241, 196, 15, 1)", // Warm Yellow
              "rgba(26, 188, 156, 1)", // Aqua Teal
              "rgba(230, 126, 34, 1)", // Rich Orange
            ],
            borderWidth: 1,
            barThickness: 15,
            maxBarThickness: 15,
          },
        ],
      }
    : null;

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: "rgba(155, 155, 155, 0.5)",
        },
      },
      y: {
        grid: {
          color: "rgba(155, 155, 155, 0.5)",
        },
      },
    },
  };

  return (
    playlist && (
      <div className="flex pr-24 pl-24 text-white pt-6 ml-24">
        <div className="w-1/3 flex flex-col items-center">
          {playlist.images && playlist.images.length > 0 ? (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-60 h-60 mb-4"
            />
          ) : (
            <div className="w-60 h-60 bg-gray-400 flex items-center justify-center text-gray-700 mb-4"></div>
          )}
          <div className="flex items-center mb-1">
            <button
              onClick={openEditModal}
              className="text-[#1ED760] hover:text-[#ffffff] mr-4"
            >
              <FaEdit size={20} />
            </button>
            <h2 className="text-2xl font-bold text-center">{playlist.name}</h2>
            <button
              onClick={openDeleteModal}
              className="text-red-500 hover:text-white ml-4"
            >
              <FaTrashAlt size={20} />
            </button>
          </div>
          <p className="text-sm text-[#9b9b9b] text-center mb-3">
            By {playlist.owner.display_name}
          </p>
          <p className="text-xs text-[#9b9b9b] text-center tracking-widest">
            {playlist.tracks.total} TRACKS
          </p>

          {/* Get Recommendations Button */}
          <Link
            to={`/playrec/${id}`} // Link to the PlayRec page
            className="mt-4 inline-block px-4 py-2 bg-[#1ED760] text-black font-bold rounded-full text-xs"
          >
            Get Recommendations
          </Link>

          {/* Audio Features Bar Chart */}
          {audioFeatures && (
            <div className="mt-6 w-[90%]">
              <h3 className="text-xl font-bold text-center mb-4">
                Audio Features
              </h3>
              <div className="mr-6 h-[85%]">
                <Bar
                  className="mr-6"
                  data={data}
                  options={options}
                  height={400}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-2/3 pl-4">
          <ul>
            {playlist.tracks.items.map((item, index) => (
              <SongItem key={index} track={item.track} index={index} />
            ))}
          </ul>
        </div>

        {/* Edit Playlist Name Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#282828] p-6 rounded-lg w-[80%] max-w-md text-white relative">
              <h2 className="text-lg font-bold mb-4">Edit Playlist Name</h2>
              <input
                type="text"
                value={newPlaylistName}
                onChange={handleNameChange}
                className="w-full p-2 rounded-md border border-gray-300 text-white mb-4 bg-[#040306]"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-[#040306] text-white rounded-full font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={savePlaylistName}
                  className="px-4 py-2 bg-[#1ED760] text-black rounded-full font-bold"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#282828] p-6 rounded-lg w-[80%] max-w-md text-white relative">
              <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-[#040306] text-white rounded-full font-bold"
                >
                  No
                </button>
                <button
                  onClick={confirmDeletePlaylist}
                  className="px-4 py-2 bg-[#1ED760] text-black rounded-full font-bold"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default PlaylistDetail;
