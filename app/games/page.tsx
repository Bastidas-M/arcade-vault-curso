'use client';

import Library from '@/components/Library';
import { useNavigate } from '@/hooks/useNavigate';

export default function GamesPage() {
  const navigate = useNavigate();
  return <Library navigate={navigate} />;
}
