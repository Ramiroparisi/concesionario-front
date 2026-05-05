'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/services/authService';
import { api } from '@/lib/axios';
import Link from 'next/link';

interface UserData {
  rol: 'Admin' | 'Empleado';
  nombre: string;
  apellido: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await api.get('/auth/verify-token');
        setUser(res.data.user);
      } catch (error) {
        router.push('/usuario/login');
      }
    };
    verificar();
  }, [router]);

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/usuario/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 md:relative 
          
          bg-gray-800 text-white flex flex-col shadow-xl
          transition-all duration-300 ease-in-out
          
          ${isOpen 
            ? 'w-[280px] translate-x-0 opacity-100 m-0 md:m-4 md:rounded-2xl' 
            : 'w-0 -translate-x-full md:translate-x-0 opacity-0 overflow-hidden m-0'}
        `}
      >
        <div className="flex flex-col h-full min-w-[280px]">
          <div className="p-6 pt-20 md:pt-6 text-center border-b border-gray-700">
            <span className="text-[18px] bg-blue-900/50 text-blue-200 px-4 py-1 rounded-full uppercase border border-blue-800 font-bold tracking-wider">
              {user.rol}
            </span>
            <span className="text-[14px] bg-blue-800/50 text-blue-200 px-4 py-1 rounded-full uppercase border border-blue-800 font-bold tracking-wider mt-3 block">
              {user.nombre + ' ' + user.apellido}
            </span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink 
              href="/usuario/dashboard" 
              label="Inicio" 
              active={isActive('/usuario/dashboard')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />
            <SidebarLink 
              href="/usuario/dashboard/marcas" 
              label="Marcas" 
              active={isActive('/usuario/dashboard/marcas')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />
            <SidebarLink 
              href="/usuario/dashboard/modelos" 
              label="Modelos" 
              active={isActive('/usuario/dashboard/modelos')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />
            <SidebarLink 
              href="/usuario/dashboard/vehiculos" 
              label="Vehículos" 
              active={isActive('/usuario/dashboard/vehiculos')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />
            <SidebarLink 
              href="/usuario/dashboard/reservas" 
              label="Reservas" 
              active={isActive('/usuario/dashboard/reservas')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />
            <SidebarLink 
              href="/usuario/dashboard/ventas" 
              label="Ventas" 
              active={isActive('/usuario/dashboard/ventas')} 
              onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
            />              
            {user.rol === 'Admin' && (
              <SidebarLink 
                href="/usuario/dashboard/empleados" 
                label="Empleados" 
                active={isActive('/usuario/dashboard/empleados')} 
                onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
              />
            )}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
        active 
          ? 'bg-gray-300 text-black shadow-lg shadow-gray-900/20' 
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}