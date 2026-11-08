'use client';

import { useRouter } from 'next/navigation';
import { routeToPath } from '@/lib/routes';
import type { Route } from '@/lib/types';

export function useNavigate() {
  const router = useRouter();
  return (route: Route) => router.push(routeToPath(route));
}
