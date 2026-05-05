'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white text-gray-900 w-full shadow-sm z-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl md:text-3xl font-light tracking-widest uppercase">
              Parisi Motors
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <HeaderLink href="/" label="Inicio" active={isActive('/')} className=" hover:text-black" />
            <HeaderLink href="/Vehiculos" label="Vehiculos" active={isActive('/Vehiculos')} className=" hover:text-black" />
            <HeaderLink href="/SobreNosotros" label="Sobre nosotros" active={isActive('/SobreNosotros')} className=" hover:text-black" />
            <HeaderLink href="/Contacto" label="Contacto" active={isActive('/Contacto')} className=" hover:text-black" />
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 focus:outline-none">
              {isOpen ? 'X' : <HiMenu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <nav className="flex flex-col space-y-4 px-6 py-8">
            <HeaderLink href="/" label="Inicio" active={isActive('/')} className="w-fit" onClick={() => setIsOpen(false)} />
            <HeaderLink href="/Vehiculos" label="Vehiculos" active={isActive('/Vehiculos')} className="w-fit" onClick={() => setIsOpen(false)} />
            <HeaderLink href="/SobreNosotros" label="Sobre nosotros" active={isActive('/SobreNosotros')} className="w-fit" onClick={() => setIsOpen(false)} />
            <HeaderLink href="/Contacto" label="Contacto" active={isActive('/Contacto')} className="w-fit" onClick={() => setIsOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function HeaderLink({ href, label, active, className, onClick }: { href: string; label: string; active: boolean; className?: string; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`text-base md:text-xl transition-colors duration-200 font-light ${
        active 
          ? 'text-black font-normal border-b border-black pb-1'
          : 'text-gray-500 hover:text-black'
      } ${className}`}
    >
      {label}
    </Link>
  );
}