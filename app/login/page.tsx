'use client';

import { useState } from 'react';

export default function Login() {
  const handleLogin = () => {
    // Redirect to backend endpoint to initiate Spotify OAuth
    window.location.href = 'https://spotify-backend-sigma.vercel.app/auth/login';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-4">Spotify Profile Viewer</h1>
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white py-2 px-4 rounded"
      >
        Login with Spotify
      </button>
    </div>
  );
}
