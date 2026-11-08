'use client';

import Home from '@/components/Home';
import { useNavigate } from '@/hooks/useNavigate';

export default function HomePage() {
  const navigate = useNavigate();
  return <Home navigate={navigate} />;
}
