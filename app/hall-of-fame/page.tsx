'use client';

import HallOfFame from '@/components/HallOfFame';
import { useNavigate } from '@/hooks/useNavigate';

export default function HallOfFamePage() {
  const navigate = useNavigate();
  return <HallOfFame navigate={navigate} />;
}
