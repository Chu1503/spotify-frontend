import React, { useEffect, useState } from "react";
import axios from "axios";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";

function Recent({ token }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      if (!token) {
        setError("No access token provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/recently-played",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 20,
            },
          }
        );
        setRecentlyPlayed(response.data.items);
      } catch (err) {
        console.error("Error fetching recently played tracks:", err);
        setError(
          err.response?.data?.error?.message || "Failed to fetch recently played tracks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="md:pl-48 md:pr-48 md:ml-24 md:pt-6 pl-1 pr-1 ml-0 pt-1 items-center">
        <h2 className="md:text-2xl text-lg font-bold mb-6 text-white md:text-left text-center">
        Recently Played Tracks
      </h2>
      <ul>
        {recentlyPlayed.map((item, index) => (
          <SongItem key={index} track={item.track} index={index} />
        ))}
      </ul>
    </div>
  );
}

export default Recent;