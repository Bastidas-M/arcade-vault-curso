import type { Route } from './types';

export function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home':      return '/home';
    case 'biblioteca':return '/games';
    case 'detalle':   return `/games/${route.id}`;
    case 'player':    return `/games/${route.id}/play`;
    case 'auth':      return '/auth';
    case 'salon':     return '/hall-of-fame';
    case 'about':     return '/about';
  }
}

export function pathnameToRouteName(pathname: string): string {
  if (pathname === '/home' || pathname === '/') return 'home';
  if (pathname.endsWith('/play'))               return 'player';
  if (pathname.startsWith('/games/'))           return 'detalle';
  if (pathname === '/games')                    return 'biblioteca';
  if (pathname === '/auth')                     return 'auth';
  if (pathname === '/hall-of-fame')             return 'salon';
  if (pathname === '/about')                    return 'about';
  return 'home';
}
