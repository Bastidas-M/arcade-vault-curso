'use client';

import Auth from '@/components/Auth';
import { useNavigate } from '@/hooks/useNavigate';

export default function AuthPage() {
  const navigate = useNavigate();
  return <Auth navigate={navigate} />;
}
