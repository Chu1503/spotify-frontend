import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlaylistModal from "../components/PlaylistModal";

function Recommendations({ token }) {
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [songQuery, setSongQuery] = useState(""); // State for song search input
  const [songResults, setSongResults] = useState([]); // State for song search results
  const [artistQuery, setArtistQuery] = useState(""); // State for artist search input
  const [artistResults, setArtistResults] = useState([]); // State for artist search results
  const [isSearching, setIsSearching] = useState(false); // State to manage search loading
  const navigate = useNavigate();
  const songContainerRef = useRef(null); // Reference for song search container
  const artistContainerRef = useRef(null); // Reference for artist search container

  const handlePlaylistSelect = (playlistId) => {
    setModalOpen(false); // Close the modal after selection
    navigate(`/playrec/${playlistId}`); // Navigate to PlayRec with selected playlist
  };

  const handleTrackSelect = (track) => {
    navigate(`/songrec/${track.id}`, { state: { trackName: track.name } }); // Navigate to SongRec with selected track ID and name
  };

  const handleArtistSelect = (artist) => {
    navigate(`/artrec/${artist.id}`, { state: { artistName: artist.name } }); // Navigate to ArtRec with selected artist ID and name
  };

  useEffect(() => {
    if (!songQuery.trim()) {
      setSongResults([]); // Clear song results if search query is empty
      return;
    }

    const fetchSongResults = async () => {
      setIsSearching(true);
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: songQuery,
            type: "track",
            limit: 5,
          },
        });
        setSongResults(response.data.tracks.items); // Set song search results
      } catch (err) {
        console.error("Error searching for track:", err);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce song search
    const debounceTimer = setTimeout(fetchSongResults, 300);

    return () => clearTimeout(debounceTimer);
  }, [songQuery, token]);

  useEffect(() => {
    if (!artistQuery.trim()) {
      setArtistResults([]); // Clear artist results if search query is empty
      return;
    }

    const fetchArtistResults = async () => {
      setIsSearching(true);
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: artistQuery,
            type: "artist",
            limit: 5,
          },
        });
        setArtistResults(response.data.artists.items); // Set artist search results
      } catch (err) {
        console.error("Error searching for artist:", err);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce artist search
    const debounceTimer = setTimeout(fetchArtistResults, 300);

    return () => clearTimeout(debounceTimer);
  }, [artistQuery, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        songContainerRef.current &&
        !songContainerRef.current.contains(event.target)
      ) {
        setSongResults([]); // Close song results if clicked outside
      }
      if (
        artistContainerRef.current &&
        !artistContainerRef.current.contains(event.target)
      ) {
        setArtistResults([]); // Close artist results if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div
          className="w-full max-w-md mt-8 flex flex-col items-center justify-center"
          ref={songContainerRef}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Based on Song</h2>
          <input
            type="text"
            placeholder="Enter a song"
            value={songQuery}
            onChange={(e) => setSongQuery(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 text-white mb-2 bg-[#040306]"
          />

          {/* Display song search results */}
          {songResults.length > 0 && (
            <ul className="bg-[#282828] rounded-md p-2 max-h-80 overflow-y-auto no-scrollbar w-full">
              {songResults.map((track) => (
                <li
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
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

        {/* Search Bar for Artists */}
        <div
          className="w-full max-w-md mt-8 flex flex-col items-center justify-center"
          ref={artistContainerRef}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Based on Artist</h2>
          <input
            type="text"
            placeholder="Enter an artist"
            value={artistQuery}
            onChange={(e) => setArtistQuery(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 text-white mb-2 bg-[#040306]"
          />

          {/* Display artist search results */}
          {artistResults.length > 0 && (
            <ul className="bg-[#282828] rounded-md p-2 max-h-80 overflow-y-auto no-scrollbar w-full">
              {artistResults.map((artist) => (
                <li
                  key={artist.id}
                  onClick={() => handleArtistSelect(artist)}
                  className="p-2 hover:bg-[#3e3e3e] cursor-pointer rounded text-white flex items-center"
                >
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <p className="font-bold">{artist.name}</p>
                    <p className="text-sm text-gray-400">
                      {artist.genres.slice(0, 2).join(", ")}
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