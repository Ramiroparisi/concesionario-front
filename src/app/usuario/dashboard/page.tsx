'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface UserData {
  id: number;
  rol: 'Admin' | 'Empleado';
  nombre?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [cargando, setCargando] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await api.get('/auth/verify-token');
        setUser(response.data.user);
      } catch (error) {
        router.push('/usuario/login');
      } finally {
        setCargando(false);
      }
    };
    verificarSesion();
  }, [router]);

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <header className="mb-8">
            <div className="relative z-[60] md:z-auto"> 
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-colors border border-gray-700 shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-300">
            Panel de gestión
          </h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          <Link href="/usuario/dashboard/marcas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Marcas</p>
          </Link>

          <Link href="/usuario/dashboard/modelos" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Modelos</p>
          </Link>

          <Link href="/usuario/dashboard/vehiculos" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Vehículos</p>
          </Link>

          <Link href="/usuario/dashboard/reservas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Reservas</p>
          </Link>

          <Link href="/usuario/dashboard/ventas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Ventas</p>
          </Link>
          {user.rol === 'Admin' && (
            <Link href="/usuario/dashboard/empleados" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition-all group">
              <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Empleados</p>
            </Link>
          )}
        </div>

      </main>
    </div>
  );
}