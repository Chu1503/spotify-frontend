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
    <div className="md:pl-48 md:pr-48 md:ml-24 md:pt-6 pl-1 pr-1 ml-0 pt-1">
      <div className="flex md:flex-row flex-col items-center justify-between">
        <h2 className="md:text-2xl text-lg font-bold mb-6 text-white">
          Top Tracks
        </h2>
        <div className="flex space-x-4 mb-4 text-white md:text-sm text-xs">
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
