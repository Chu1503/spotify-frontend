import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

function TopArtists({ token }) {
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("long_term");

  const timeRangeOptions = {
    "All Time": "long_term",
    "Last 6 Months": "medium_term",
    "Last 4 Weeks": "short_term",
  };

  useEffect(() => {
    if (!token) {
      setError("Authorization token is missing.");
      setLoading(false);
      return;
    }

    const fetchTopArtists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
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
        setTopArtists(response.data.items);
      } catch (err) {
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${err.response.data.error.message}`
          );
        } else if (err.request) {
          setError("No response received from Spotify API.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [token, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center h-full">
        {error}
      </div>
    );
  }

  return (
    <div className="md:pl-48 md:pr-48 md:ml-24 md:pt-6 pl-1 pr-1 ml-0 pt-1">
      <div className="flex md:flex-row flex-col items-center justify-between">
        <h2 className="md:text-2xl text-lg font-bold mb-6 text-white">
          Top Artists
        </h2>
        <div className="flex space-x-4 mb-4 text-white md:text-sm text-xs">
          {Object.keys(timeRangeOptions).map((label) => (
            <button
              key={label}
              onClick={() => setTimeRange(timeRangeOptions[label])}
              className={`${
                timeRange === timeRangeOptions[label]
                  ? "underline font-bold md:text-sm text-xs"
                  : "text-[#9b9b9b]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {topArtists.map((artist) => (
          <Link
            to={`/artist/${artist.id}`}
            key={artist.id}
            className="flex flex-col items-center text-center"
          >
            <div className="relative group">
              {artist.images && artist.images.length > 0 ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="md:w-36 md:h-36 w-18 h-18 rounded-full object-cover aspect-square mb-2 mt-2"
                />
              ) : (
                <div className="md:w-36 md:h-36 w-18 h-18 rounded-full bg-gray-400 flex items-center justify-center text-gray-700 mb-2"></div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FaInfoCircle className="text-white text-xl" />
              </div>
            </div>
            <h3 className="md:text-sm text-xs font-semibold text-white mt-2">
              {artist.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopArtists;
