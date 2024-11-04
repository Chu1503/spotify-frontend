import React from "react";
import { NavLink } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { PiMicrophoneStage, PiUserFill, PiMusicNotesFill, PiPlaylist  } from "react-icons/pi";
import { MdOutlineHistory } from "react-icons/md";
import { SiMagic } from "react-icons/si";

function Sidebar({ user, handleLogout }) {
  return (
    <div className="w-24 bg-[#040306] text-[#9b9b9b] flex flex-col h-screen fixed top-0 left-0">
      <nav className="flex-1 mt-10">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760] text-white" : ""
            }`
          }
        >
          <PiUserFill className="mb-1" size={32} />
          <p className="text-xs font-semibold">Profile</p>
        </NavLink>
        <NavLink
          to="/top-artists"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760]" : ""
            }`
          }
        >
          <PiMicrophoneStage className="mb-1" size={32} />
          <p className="text-xs font-semibold">Top Artists</p>
        </NavLink>
        <NavLink
          to="/top-tracks"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760]" : ""
            }`
          }
        >
          <PiMusicNotesFill className="mb-1" size={32} />
          <p className="text-xs font-semibold">Top Tracks</p>
        </NavLink>
        <NavLink
          to="/recent"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760]" : ""
            }`
          }
        >
          <MdOutlineHistory className="mb-1" size={32} />
          <p className="text-xs font-semibold">Recent</p>
        </NavLink>
        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760]" : ""
            }`
          }
        >
          <PiPlaylist className="mb-1" size={32} />
          <p className="text-xs font-semibold">Playlists</p>
        </NavLink>
        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:bg-[#3e3e3e] hover:border-l-8 border-l-[#1ED760] transition-colors ${
              isActive ? "bg-[#3e3e3e] border-l-8 border-l-[#1ED760]" : ""
            }`
          }
        >
          <SiMagic className="mb-1" size={32} />
          <p className="text-xs font-semibold">Recommend</p>
        </NavLink>
      </nav>

      {/* Logout Button */}
      {user && (
        <div className="p-8">
          <button onClick={handleLogout} className="">
            <RiLogoutCircleLine 
              size={36}
              color="red"
            />
          </button>
          {/* <p className="text-xs font-semibold">Logout</p> */}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
