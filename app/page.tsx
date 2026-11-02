'use client';

import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import Library from '@/components/Library';
import GameDetail from '@/components/GameDetail';
import GamePlayer from '@/components/GamePlayer';
import Auth from '@/components/Auth';
import HallOfFame from '@/components/HallOfFame';
import type { Route } from '@/lib/types';

export default function Home() {
  const [route, setRoute] = useState<Route>({ name: 'biblioteca' });

  const navigate = (r: Route) => setRoute(r);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  let screen: React.ReactNode = null;
  if (route.name === 'biblioteca') screen = <Library navigate={navigate} />;
  else if (route.name === 'detalle' && route.id) screen = <GameDetail id={route.id} navigate={navigate} />;
  else if (route.name === 'player' && route.id) screen = <GamePlayer id={route.id} navigate={navigate} />;
  else if (route.name === 'auth') screen = <Auth navigate={navigate} />;
  else if (route.name === 'salon') screen = <HallOfFame navigate={navigate} />;

  return (
    <>
      <div className="av-bg" />
      <div className="av-noise" />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Nav route={route} navigate={navigate} />
        <main className="av-main">{screen}</main>
        <footer style={{
          borderTop: '1px solid var(--line)',
          padding: '20px 32px',
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
        }}>
          © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
        </footer>
      </div>
    </>
  );
}
