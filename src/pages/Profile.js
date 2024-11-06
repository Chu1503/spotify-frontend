import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Profile({ user, playlistsCount }) {
  // Check if user data is available
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#1ED760" size={100} />
      </div>
    );
  }

  return (
    <div className="text-white p-6 ml-24">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        {user.images && user.images.length > 0 ? (
          <img
            src={user.images[0].url}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-gray-700">
          </div>
        )}

        {/* Welcome Message */}
        <h1 className="text-2xl font-bold mb-2">
          Welcome, <span className="text-[#1ED760]">{user.display_name}</span>!
        </h1>

        {/* Followers and Playlists Count */}
        <div className="flex space-x-10 mt-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1ED760]">{user.followers.total}</p>
            <p className="text-xs tracking-wider text-[#9b9b9b]">FOLLOWERS</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1ED760]">{playlistsCount}</p>
            <p className="text-xs tracking-wider text-[#9b9b9b]">PLAYLISTS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
