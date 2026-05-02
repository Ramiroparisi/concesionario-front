'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white text-gray-900 w-full shadow-sm z-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-light tracking-widest uppercase">
              Parisi Motors
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <HeaderLink href="/" label="Inicio" active={isActive('/')} className=" hover:text-black" />
            <HeaderLink href="/Vehiculos" label="Vehiculos" active={isActive('/Vehiculos')} className=" hover:text-black" />
            <HeaderLink href="/SobreNosotros" label="Sobre nosotros" active={isActive('/SobreNosotros')} className=" hover:text-black" />
            <HeaderLink href="/Contacto" label="Contacto" active={isActive('/Contacto')} className=" hover:text-black" />
          </nav>

        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, label, active, className }: { href: string; label: string; active: boolean; className: string }) {
  return (
    <Link 
      href={href} 
      className={`text-base transition-colors duration-200 font-light ${
        active 
          ? 'text-black font-normal border-b border-black pb-1'
          : 'text-gray-500 hover:text-black'
      } ${className}`}
    >
      {label}
    </Link>
  );
}