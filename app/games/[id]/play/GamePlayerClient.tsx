'use client';

import GamePlayer from '@/components/GamePlayer';
import { useNavigate } from '@/hooks/useNavigate';

export default function GamePlayerClient({ id }: { id: string }) {
  const navigate = useNavigate();
  return <GamePlayer id={id} navigate={navigate} />;
}
