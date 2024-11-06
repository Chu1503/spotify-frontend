// SongItem.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

const SongItem = ({ track, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/song/${track.id}`);
  };

  return (
    <li
      className="flex items-center pt-2 pb-4 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative flex items-center flex-1">
        {track.album.images && track.album.images.length > 0 ? (
          <div className="relative mr-4 w-10 h-10">
            <img
              src={track.album.images[0].url}
              alt={track.name}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200"></div>

            {/* Info icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <FaInfoCircle className="text-white text-xl" />
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-400 mr-4 flex items-center justify-center text-gray-700">
          </div>
        )}

        <div>
          <p className="text-md font-semibold text-white hover:underline">
            {track.name}
          </p>
          <p className="text-xs text-[#9b9b9b]">
            {track.artists.map((artist) => artist.name).join(", ")}
            <span className="mx-1">•</span>
            {track.album.name}
          </p>
        </div>
      </div>
      <p className="text-xs text-[#9b9b9b] mr-24">
        {Math.floor(track.duration_ms / 60000)}:
        {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
      </p>
    </li>
  );
};

export default SongItem;