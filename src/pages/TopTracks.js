import React, { useEffect, useState } from "react";
import axios from "axios";
import SongItem from "../components/SongItem";
import ClipLoader from "react-spinners/ClipLoader";

function TopTracks({ token }) {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("long_term");

  const timeRangeOptions = {
    "All Time": "long_term",
    "Last 6 Months": "medium_term",
    "Last 4 Weeks": "short_term",
  };

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 50,
              time_range: timeRange,
            },
          }
        );
        setTopTracks(response.data.items);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching top tracks:", err);
        setError("Failed to fetch top tracks.");
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [token, timeRange]);

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
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-6 text-white">Top Tracks</h2>
        <div className="flex space-x-4 mb-4 text-white text-sm mr-24">
          {Object.keys(timeRangeOptions).map((label) => (
            <button
              key={label}
              onClick={() => setTimeRange(timeRangeOptions[label])}
              className={`${
                timeRange === timeRangeOptions[label]
                  ? "underline font-bold"
                  : "text-[#9b9b9b]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Tracks List */}
      {topTracks.map((track, index) => (
        <SongItem key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}

export default TopTracks;