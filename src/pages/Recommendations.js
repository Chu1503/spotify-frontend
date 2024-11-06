import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlaylistModal from "../components/PlaylistModal";

function Recommendations({ token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmAction, setModalConfirmAction] = useState(null); // Define modalConfirmAction
  const [songQuery, setSongQuery] = useState("");
  const [songResults, setSongResults] = useState([]);
  const [artistQuery, setArtistQuery] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const navigate = useNavigate();
  const songContainerRef = useRef(null);
  const artistContainerRef = useRef(null);

  // Handle playlist selection for PlayRec page
  const handlePlaylistSelectForPlayRec = (playlistId) => {
    setModalOpen(false);
    navigate(`/playrec/${playlistId}`);
  };

  // Handle playlist selection for PlaylistSplitter page
  const handlePlaylistSelectForSplitter = (playlistId) => {
    setModalOpen(false);
    navigate(`/playlist-splitter/${playlistId}`);
  };

  const handleTrackSelect = (track) => {
    navigate(`/songrec/${track.id}`, { state: { trackName: track.name } });
  };

  const handleArtistSelect = (artist) => {
    navigate(`/artrec/${artist.id}`, { state: { artistName: artist.name } });
  };

  useEffect(() => {
    if (!songQuery.trim()) {
      setSongResults([]);
      return;
    }

    const fetchSongResults = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: songQuery,
            type: "track",
            limit: 5,
          },
        });
        setSongResults(response.data.tracks.items);
      } catch (err) {
        console.error("Error searching for track:", err);
      }
    };

    const debounceTimer = setTimeout(fetchSongResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [songQuery, token]);

  useEffect(() => {
    if (!artistQuery.trim()) {
      setArtistResults([]);
      return;
    }

    const fetchArtistResults = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: artistQuery,
            type: "artist",
            limit: 5,
          },
        });
        setArtistResults(response.data.artists.items);
      } catch (err) {
        console.error("Error searching for artist:", err);
      }
    };

    const debounceTimer = setTimeout(fetchArtistResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [artistQuery, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        songContainerRef.current &&
        !songContainerRef.current.contains(event.target)
      ) {
        setSongResults([]);
      }
      if (
        artistContainerRef.current &&
        !artistContainerRef.current.contains(event.target)
      ) {
        setArtistResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Recommendations</h2>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4 text-white">Based on Playlist</h2>

        {/* Button to Choose Playlist for PlayRec */}
        <button
          onClick={() => {
            setModalOpen(true);
            setModalConfirmAction(() => handlePlaylistSelectForPlayRec); // Set action for PlayRec
          }}
          className="px-6 py-3 bg-[#1ED760] rounded-full font-bold hover:bg-[#1ED760] transition duration-300"
        >
          Choose Playlist
        </button>

        {/* Button to Split Playlist by Genre */}
        <button
          onClick={() => {
            setModalOpen(true);
            setModalConfirmAction(() => handlePlaylistSelectForSplitter); // Set action for PlaylistSplitter
          }}
          className="px-6 py-3 bg-[#1ED760] rounded-full font-bold hover:bg-[#1ED760] transition duration-300 mt-4"
        >
          Split Playlist by Genre
        </button>

        {/* Rest of the component logic for song and artist search */}
        <div className="w-full max-w-4xl flex flex-row justify-between space-x-4 mt-6">
          {/* Search Bar for Songs */}
          <div
            className="w-full flex-grow flex flex-col items-center"
            ref={songContainerRef}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              Based on Song
            </h2>
            <input
              type="text"
              placeholder="Enter a song"
              value={songQuery}
              onChange={(e) => setSongQuery(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 text-white mb-2 bg-[#040306]"
            />
            {/* Display song search results */}
            {songResults.length > 0 && (
              <ul className="bg-[#282828] rounded-md p-2 max-h-100 overflow-y-auto no-scrollbar w-full">
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
            className="w-full flex-grow flex flex-col"
            ref={artistContainerRef}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              Based on Artist
            </h2>
            <input
              type="text"
              placeholder="Enter an artist"
              value={artistQuery}
              onChange={(e) => setArtistQuery(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 text-white mb-2 bg-[#040306]"
            />
            {/* Display artist search results */}
            {artistResults.length > 0 && (
              <ul className="bg-[#282828] rounded-md p-2 max-h-100 overflow-y-auto no-scrollbar w-full">
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
        </div>

        {/* Display Playlist Modal if Open */}
        {modalOpen && (
          <PlaylistModal
            token={token}
            onSelect={(playlistId) => modalConfirmAction(playlistId)} // Call the selected action
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Recommendations;
