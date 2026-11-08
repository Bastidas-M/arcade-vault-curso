'use client';

import GameDetail from '@/components/GameDetail';
import { useNavigate } from '@/hooks/useNavigate';

export default function GameDetailClient({ id }: { id: string }) {
  const navigate = useNavigate();
  return <GameDetail id={id} navigate={navigate} />;
}
