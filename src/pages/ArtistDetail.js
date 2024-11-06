import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import SongItem from "../components/SongItem";

function ArtistDetail({ token }) {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]); // State for top tracks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        // Fetch artist details
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArtist(artistResponse.data);

        // Fetch artist's top tracks
        const topTracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${id}/top-tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { market: "US" }, // Specify a market to get top tracks
          }
        );
        setTopTracks(topTracksResponse.data.tracks);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching artist details:", err);
        setError("Failed to fetch artist details.");
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  return (
    <div className="pl-48 pr-48 ml-24 pt-6">
      <div className="flex flex-col items-center justify-center text-white">
        {artist && (
          <>
            {artist.images && artist.images.length > 0 && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-48 h-48 rounded-full object-cover mb-4"
              />
            )}
            <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
            <div className="flex space-x-8 text-gray-300 text-lg mt-4 justify-center">
              <div className="flex flex-col items-center justify-center">
                <p className="font-black text-md text-[#1ED760]">
                  {artist.followers.total.toLocaleString()}
                </p>
                <p className="font-black text-xs text-[#9b9b9b]">FOLLOWERS</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-black text-md text-[#1ED760]">
                  {artist.genres.map((genre) => genre.toUpperCase()).join(", ")}
                </p>
                <p className="font-black text-xs text-[#9b9b9b]">GENRES</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-black text-md text-[#1ED760]">
                  {artist.popularity}%
                </p>
                <p className="font-black text-xs text-[#9b9b9b]">POPULARITY</p>
              </div>
            </div>

            {/* Get Recommendations Button */}
            <Link
              to={`/artrec/${id}`}
              state={{ artistName: artist.name }} // Pass the artist name in state
              className="mt-4 inline-block px-4 py-2 bg-[#1ED760] text-black font-bold rounded-full text-xs"
            >
              Get Recommendations
            </Link>

            {/* Popular Songs */}
            <h2 className="text-xl font-bold mt-8 mb-4">Popular Songs</h2>
            <ul className="w-full">
              {topTracks.map((track, index) => (
                <SongItem key={track.id} track={track} index={index} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ArtistDetail;
