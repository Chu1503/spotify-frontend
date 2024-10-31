// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Spotify Profile Viewer',
  description: 'View your Spotify profile, including playlists and followers',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        {children}
      </body>
    </html>
  );
}