import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SongDetail = ({ token }) => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Map numbers to musical keys
  const keys = [
    "C",
    "C♯/D♭",
    "D",
    "D♯/E♭",
    "E",
    "F",
    "F♯/G♭",
    "G",
    "G♯/A♭",
    "A",
    "A♯/B♭",
    "B",
  ];

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSong(response.data);
      } catch (error) {
        console.error("Error fetching song details:", error);
        setError("Failed to fetch song details.");
      }
    };

    const fetchAudioFeatures = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/audio-features/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudioFeatures(response.data);
      } catch (error) {
        console.error("Error fetching audio features:", error);
        setError("Failed to fetch audio features.");
      }
    };

    const fetchAudioAnalysis = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/audio-analysis/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudioAnalysis(response.data);
      } catch (error) {
        console.error("Error fetching audio analysis:", error);
        setError("Failed to fetch audio analysis.");
      }
      setLoading(false);
    };

    // Fetch all data
    fetchSongDetails();
    fetchAudioFeatures();
    fetchAudioAnalysis();
  }, [songId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  // Data for the Bar Chart
  const data = {
    labels: [
      "acousticness",
      "danceability",
      "energy",
      "instrumentalness",
      "liveness",
      "speechiness",
      "valence",
    ],
    datasets: [
      {
        label: "Audio Features",
        data: [
          audioFeatures.acousticness,
          audioFeatures.danceability,
          audioFeatures.energy,
          audioFeatures.instrumentalness,
          audioFeatures.liveness,
          audioFeatures.speechiness,
          audioFeatures.valence,
        ],
        backgroundColor: [
          "rgba(231, 76, 60, 0.7)", // Vibrant Red
          "rgba(52, 152, 219, 0.7)", // Cool Blue
          "rgba(46, 204, 113, 0.7)", // Fresh Green
          "rgba(155, 89, 182, 0.7)", // Deep Purple
          "rgba(241, 196, 15, 0.7)", // Warm Yellow
          "rgba(26, 188, 156, 0.7)", // Aqua Teal
          "rgba(230, 126, 34, 0.7)", // Rich Orange
        ],
        borderColor: [
          "rgba(231, 76, 60, 1)", // Vibrant Red
          "rgba(52, 152, 219, 1)", // Cool Blue
          "rgba(46, 204, 113, 1)", // Fresh Green
          "rgba(155, 89, 182, 1)", // Deep Purple
          "rgba(241, 196, 15, 1)", // Warm Yellow
          "rgba(26, 188, 156, 1)", // Aqua Teal
          "rgba(230, 126, 34, 1)", // Rich Orange
        ],
        borderWidth: 2,
        barThickness: 70,
        maxBarThickness: 100,
      },
    ],
  };

  // Options for the Bar Chart
  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: "rgba(155, 155, 155, 0.5)",
        },
      },
      x: {
        grid: {
          color: "rgba(155, 155, 155, 0.5)",
        },
      },
    },
  };

  return (
    <div className="text-white pt-6 pl-48 pr-48">
      <div className="flex items-center mb-8">
        <img
          src={song.album.images[0].url}
          alt={song.name}
          className="w-36 h-36 mr-6"
        />
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">{song.name}</h1>
          <p className="text-md font-semibold text-[#9b9b9b] mb-1">
            {song.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className="text-sm font-semibold text-[#9b9b9b]">
            {song.album.name} •{" "}
            {new Date(song.album.release_date).getFullYear()}
          </p>
          <a
            href={song.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-3 py-2 bg-[#1ED760] text-white font-bold rounded-full text-xs"
          >
            PLAY ON SPOTIFY
          </a>
        </div>
      </div>

      {/* Feature Table */}
      <div className="grid grid-cols-5 text-center text-sm border border-[#363636] text-[#b3b3b3]">
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">
            {Math.floor(song.duration_ms / 60000)}:
            {String(Math.floor((song.duration_ms % 60000) / 1000)).padStart(
              2,
              "0"
            )}
          </span>
          <br />
          <span className="text-xs">Duration</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{keys[audioFeatures.key]}</span>{" "}
          <br />
          <span className="text-xs">Key</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">
            {audioFeatures.mode === 1 ? "Major" : "Minor"}
          </span>
          <br />
          <span className="text-xs">Modality</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">
            {audioFeatures.time_signature}
          </span>
          <br />
          <span className="text-xs">Time Signature</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">
            {Math.round(audioFeatures.tempo)}
          </span>
          <br />
          <span className="text-xs">Tempo (BPM)</span>
        </div>

        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{song.popularity}%</span>
          <br />
          <span className="text-xs">Popularity</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{audioAnalysis.bars.length}</span>
          <br />
          <span className="text-xs">Bars</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{audioAnalysis.beats.length}</span>
          <br />
          <span className="text-xs">Beats</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{audioAnalysis.sections.length}</span>
          <br />
          <span className="text-xs">Sections</span>
        </div>
        <div className="border border-[#363636] p-4">
          <span className="font-black text-xl">{audioAnalysis.segments.length}</span>
          <br />
          <span className="text-xs">Segments</span>
        </div>
      </div>

      {/* Audio Features Chart */}
      <div className="flex justify-center mt-10">
        <div className="w-[75%]">
          <Bar
            data={data}
            options={{
              ...options,
              maintainAspectRatio: false,
            }}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default SongDetail;