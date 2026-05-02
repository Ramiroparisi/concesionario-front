'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { LiaFacebookSquare } from 'react-icons/lia';
import { SiX } from "react-icons/si";

export default function Footer() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="bg-gray-900 text-white w-full mt-auto">
      <div className="w-full px-6 lg:px-12">
        <div className="grid grid-cols-4 items-center py-12">
          <div className="flex justify-start">
            <Link href="/" className="text-3xl font-light tracking-widest uppercase">
              Parisi Motors
            </Link>
          </div>

          <nav className="flex flex-col space-y-4 items-center">
            <FooterLink href="/" label="Inicio" active={isActive('/')} />
            <FooterLink href="/Vehiculos" label="Vehículos" active={isActive('/Vehiculos')} />
            <FooterLink href="/SobreNosotros" label="Sobre nosotros" active={isActive('/SobreNosotros')} />
            <FooterLink href="/Contacto" label="Contacto" active={isActive('/Contacto')} />
          </nav>

          <nav className="flex flex-col space-y-4 items-center">
            <FooterLink href="/aviso-legal" label="Aviso Legal" active={isActive('/aviso-legal')} />
            <FooterLink href="/politica-privacidad" label="Política de Privacidad" active={isActive('/politica-privacidad')} />
            <FooterLink href="/terminos-y-condiciones" label="Términos y Condiciones" active={isActive('/terminos-y-condiciones')} />
          </nav>


          <div className="flex flex-col items-center justify-end md:justify-end space-y-6">
            <Link href="https://instagram.com" 
              className="flex justify-end gap-2 text-gray-400 hover:text-white transition-colors">
              <FaInstagram size={24} /> 
              <span className="font-light">Instagram</span>
            </Link>

            <Link href="https://facebook.com" 
              className="flex justify-end gap-2 text-gray-400 hover:text-white transition-colors">
              <LiaFacebookSquare size={24} /> 
              <span className="font-light">Facebook</span>
            </Link>

            <Link href="https://x.com" 
              className="flex justify-end gap-2 text-gray-400 hover:text-white transition-colors">
              <SiX size={24} /> 
              <span className="font-light">X</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`text-base transition-colors duration-200 font-light ${
        active 
          ? 'text-white font-normal border-b border-white pb-1'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
