'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { routeToPath, pathnameToRouteName } from '@/lib/routes';
import type { Route } from '@/lib/types';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const activeRoute = pathnameToRouteName(pathname);

  const isActive = (name: string) =>
    activeRoute === name ||
    (name === 'biblioteca' && (activeRoute === 'detalle' || activeRoute === 'player'));

  const go = (r: Route) => { setOpen(false); router.push(routeToPath(r)); };

  return (
    <>
      <nav className="av-nav">
        <div className="logo" onClick={() => go({ name: 'home' })}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </div>

        <div className="links">
          <a className={isActive('home') ? 'active' : ''} onClick={() => go({ name: 'home' })}>Inicio</a>
          <a className={isActive('biblioteca') ? 'active' : ''} onClick={() => go({ name: 'biblioteca' })}>Biblioteca</a>
          <a className={isActive('salon') ? 'active' : ''} onClick={() => go({ name: 'salon' })}>Salón de la Fama</a>
          <a className={isActive('about') ? 'active' : ''} onClick={() => go({ name: 'about' })}>Acerca</a>
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button className="btn ghost auth-btn" onClick={signOut}>{user.name} ▾</button>
        ) : (
          <button className="btn auth-btn" onClick={() => go({ name: 'auth' })}>Iniciar Sesión</button>
        )}

        <button className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menú">≡</button>
      </nav>

      <div className={'av-mobile-backdrop' + (open ? ' open' : '')} onClick={() => setOpen(false)} />
      <aside className={'av-mobile-panel' + (open ? ' open' : '')}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>MENÚ</div>
        <a className={isActive('home') ? 'active' : ''} onClick={() => go({ name: 'home' })}>Inicio</a>
        <a className={isActive('biblioteca') ? 'active' : ''} onClick={() => go({ name: 'biblioteca' })}>Biblioteca</a>
        <a className={isActive('salon') ? 'active' : ''} onClick={() => go({ name: 'salon' })}>Salón de la Fama</a>
        <a className={isActive('about') ? 'active' : ''} onClick={() => go({ name: 'about' })}>Acerca</a>
        <a className={isActive('auth') ? 'active' : ''} onClick={() => go({ name: 'auth' })}>{user ? 'Cuenta' : 'Iniciar Sesión'}</a>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.16em' }}>CRÉDITOS · 03</div>
      </aside>
    </>
  );
}
