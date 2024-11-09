import React from "react";
import { NavLink } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  PiMicrophoneStage,
  PiUserFill,
  PiMusicNotesFill,
  PiPlaylist,
} from "react-icons/pi";
import { MdOutlineHistory } from "react-icons/md";
import { SiMagic } from "react-icons/si";

function Sidebar({ user, handleLogout }) {
  return (
    // <div className="w-24 bg-[#040306] text-[#9b9b9b] flex flex-col h-screen fixed top-0 left-0">
    <div className="md:w-24 md:h-screen w-full h-20 bg-[#040306] text-[#9b9b9b] flex fixed md:top-0 bottom-0 left-0">
      {/* <nav className="flex-1 mt-10"> */}
      <nav className="md:flex-1 md:mt-10 md:flex-col flex flex-row w-full">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <PiUserFill className="mb-1" size={32}  />
          <p className="md:text-xs text-[10px] text-center font-semibold">Profile</p>
        </NavLink>
        <NavLink
          to="/top-artists"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <PiMicrophoneStage className="mb-1" size={32} />
          <p className="md:text-xs text-[10px] text-center font-semibold">Top Artists</p>
        </NavLink>
        <NavLink
          to="/top-tracks"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <PiMusicNotesFill className="mb-1" size={32} />
          <p className="md:text-xs text-[10px] text-center font-semibold">Top Tracks</p>
        </NavLink>
        <NavLink
          to="/recent"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <MdOutlineHistory className="mb-1" size={32} />
          <p className="md:text-xs text-[10px] text-center font-semibold">Recent</p>
        </NavLink>
        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <PiPlaylist className="mb-1" size={32} />
          <p className="md:text-xs text-[10px] text-center font-semibold">Playlists</p>
        </NavLink>
        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            `flex flex-col items-center py-4 px-3 hover:border-l-8 hover:border-l-[#1ED760] hover:bg-[#3e3e3e] transition-colors ${
              isActive
                ? "bg-[#3e3e3e] border-t-4 border-t-[#1ED760] md:border-t-0 md:border-l-8 md:border-l-[#1ED760] text-white"
                : ""
            }`
          }
        >
          <SiMagic className="mb-1" size={32} />
          <p className="md:text-xs text-[10px] text-center font-semibold">Recommend</p>
        </NavLink>
      </nav>

      {/* Logout Button */}
      {/* {user && (
        <div className="p-8">
          <button onClick={handleLogout} className="">
            <RiLogoutCircleLine size={36} color="red" />
          </button>
          <p className="text-xs font-semibold">Logout</p>
        </div>
      )} */}
    </div>
  );
}

export default Sidebar;
