// app/page.tsx
import { useEffect, useState } from 'react';

type ProfileData = {
  imageUrl: string;
  name: string;
  followers: number;
  playlists: number;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Call backend to fetch profile data
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <img src={profile.imageUrl} alt="Profile" className="rounded-full w-32 h-32 mb-4" />
      <h1 className="text-2xl font-bold">{profile.name}</h1>
      <p>{profile.followers} Followers</p>
      <p>{profile.playlists} Playlists</p>
    </div>
  );
};

export default ProfilePage;