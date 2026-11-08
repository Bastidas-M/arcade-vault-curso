export const instant = false;

import GameDetailClient from './GameDetailClient';

export default async function GameDetailPage({ params }: PageProps<'/games/[id]'>) {
  const { id } = await params;
  return <GameDetailClient id={id} />;
}
