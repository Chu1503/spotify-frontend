import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";

function ArtRec({ token }) {
  const { artistId } = useParams(); // artist ID
  const location = useLocation();
  const [artistName, setArtistName] = useState(location.state?.artistName || ""); // Artist name from location state
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendationsResponse = await axios.get("https://api.spotify.com/v1/recommendations", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            seed_artists: artistId,
            limit: 20,
          },
        });
        setRecommendations(recommendationsResponse.data.tracks);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to fetch recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations(); // Fetch recommendations based on the artist
  }, [artistId, token]);

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
          Recommended Tracks based on <span className="text-[#1ED760]">{artistName}</span>
        </h2>
      </div>

      <ul>
        {recommendations.map((track, index) => (
          <SongItem key={track.id} track={track} index={index} />
        ))}
      </ul>
    </div>
  );
}

export default ArtRec;
