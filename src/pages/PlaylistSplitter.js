import React, { useState, useEffect } from "react";
import axios from "axios";
import { kmeans } from "ml-kmeans";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router-dom";

function PlaylistSplitter({ token }) {
  const { playlistId } = useParams();
  const [splitPlaylists, setSplitPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customPlaylistName, setCustomPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTracksAndFeatures = async () => {
      try {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const trackIds = data.items.map((item) => item.track.id).join(",");
        const { data: featuresData } = await axios.get(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const tracksWithFeatures = data.items.map((item, index) => ({
          ...item.track,
          features: featuresData.audio_features[index],
          genre: item.track.artists[0]?.genres?.[0] || "Playlist" // Use artist's genre if available
        }));

        if (tracksWithFeatures.length < 10) {
          setMessage(
            "The selected playlist does not have enough songs to create multiple clusters."
          );
        } else {
          clusterTracks(tracksWithFeatures);
        }
      } catch (err) {
        console.error("Error fetching playlist tracks or features:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracksAndFeatures();
  }, [token, playlistId]);

  const clusterTracks = (tracks) => {
    const features = tracks.map((track) => [
      track.features.acousticness,
      track.features.danceability,
      track.features.liveness,
      track.features.loudness,
      track.features.speechiness,
    ]);

    const kmeansResult = kmeans(
      features,
      Math.min(5, Math.max(2, Math.floor(tracks.length / 10)))
    );
    const clusters = Array.from(
      { length: kmeansResult.clusters.length },
      () => []
    );

    kmeansResult.clusters.forEach((clusterIndex, trackIndex) => {
      clusters[clusterIndex].push(tracks[trackIndex]);
    });

    const filteredPlaylists = clusters
      .map((cluster) => cluster.slice(0, 20))
      .filter((cluster) => cluster.length >= 5);

    setSplitPlaylists(filteredPlaylists);
  };

  const saveClusterToSpotify = async (playlistName, tracks) => {
    setSaving(true);
    try {
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      const newPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
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
      const trackUris = tracks.map((track) => track.uri);

      await axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
        { uris: trackUris },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (err) {
      console.error("Error saving playlist to Spotify:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Split Playlists by Genre
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader color="#1ED760" size={100} />
        </div>
      ) : message ? (
        <p className="text-center text-red-500">{message}</p>
      ) : (
        <>
          {splitPlaylists.map((playlist, index) => {
            const genreName = playlist[0]?.genre || `Playlist ${index + 1}`;
            return (
              <div key={index} className="mb-6">
                <div className="flex flex-row justify-between mb-6 items-center">
                  <h3 className="text-xl font-semibold text-[#1ED760]">
                    {genreName}
                  </h3>
                  <button
                    onClick={() =>
                      saveClusterToSpotify(
                        `${customPlaylistName} - ${genreName}`,
                        playlist
                      )
                    }
                    disabled={saving}
                    className="px-4 py-2 bg-[#1ED760] text-white rounded-full font-bold hover:bg-[#1db954] transition duration-300"
                  >
                    {saving ? "Saving..." : "Save to Spotify"}
                  </button>
                </div>
                <ul>
                  {playlist.map((track, idx) => (
                    <SongItem key={track.id} track={track} index={idx} />
                  ))}
                </ul>
              </div>
            );
          })}
        </>
      )}

      {showConfirmation && (
        <div className="text-center bg-[#1ED760] text-[#040306] p-2 rounded mb-4">
          Playlists saved to your Spotify account!
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-[80%] max-w-md text-white relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-2xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              Save Playlists to Spotify
            </h2>
            <input
              type="text"
              placeholder="Enter Playlist Name Prefix"
              value={customPlaylistName}
              onChange={(e) => setCustomPlaylistName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 text-white mb-4 bg-[#040306]"
            />
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => setIsPublic(true)}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  isPublic
                    ? "bg-[#1ED760] text-white"
                    : "bg-[#040306] text-white"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${
                  !isPublic
                    ? "bg-[#1ED760] text-white"
                    : "bg-[#040306] text-white"
                }`}
              >
                Private
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistSplitter;