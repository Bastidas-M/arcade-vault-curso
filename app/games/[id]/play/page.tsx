export const instant = false;

import GamePlayerClient from './GamePlayerClient';

export default async function GamePlayerPage({ params }: PageProps<'/games/[id]/play'>) {
  const { id } = await params;
  return <GamePlayerClient id={id} />;
}
