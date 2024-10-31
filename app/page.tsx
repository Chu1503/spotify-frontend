// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redirect to login page on load
  }, [router]);

  return null; // Nothing to render as it redirects immediately
}