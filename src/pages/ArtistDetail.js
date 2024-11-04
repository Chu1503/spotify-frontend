import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function ArtistDetail({ token }) {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArtist(response.data);
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
    <div className="flex flex-col items-center justify-center pt-10 text-white">
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
          {/* <a
            href={`https://open.spotify.com/artist/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-3 py-2 bg-[#1ED760] text-white font-bold rounded-full text-xs"
          >
            VIEW ARTIST ON SPOTIFY
          </a> */}
        </>
      )}
    </div>
  );
}

export default ArtistDetail;