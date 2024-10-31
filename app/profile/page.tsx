'use client';

import { useEffect, useState } from 'react';

interface UserProfile {
  display_name: string;
  followers: { total: number };
  images: { url: string }[];
  playlists: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src={profile.images[0].url}
        alt="Profile Picture"
        className="w-32 h-32 rounded-full mb-4"
      />
      <h1 className="text-2xl">{profile.display_name}</h1>
      <p>Followers: {profile.followers.total}</p>
      <p>Playlists: {profile.playlists}</p>
    </div>
  );
}
