'use client';

import About from '@/components/About';
import { useNavigate } from '@/hooks/useNavigate';

export default function AboutPage() {
  const navigate = useNavigate();
  return <About navigate={navigate} />;
}
