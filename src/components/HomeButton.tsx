'use client'
import { useRouter } from 'next/navigation';

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="fixed top-5 left-5 z-[100] flex items-center gap-2 px-20 py-4 bg-red-400 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-red-700 transition-all active:scale-95 shadow-lg group">
      <span className="text-xl font-medium  hidden sm:block"> Volver al inicio</span>
    </button>
  );
}