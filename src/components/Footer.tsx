'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { LiaFacebookSquare } from 'react-icons/lia';
import { SiX } from "react-icons/si";
import { BsClock, BsEnvelope, BsGeoAlt, BsTelephone } from 'react-icons/bs';

export default function Footer() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="bg-gray-900 text-white w-full mt-auto">
      <div className="w-full px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start py-12">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="text-3xl font-light tracking-widest uppercase">
              Parisi Motors
            </Link>
            <div className="space-y-3 mt-6">
              <ContactDetail icon={<BsGeoAlt size={18} />} content="E. Zeballos 1341, Rosario, Santa Fe" />
              <ContactDetail icon={<BsTelephone size={18} />} content="+54 341 393-2240" />
              <ContactDetail icon={<BsEnvelope size={18} />} content="parisimotors@gmail.com" />
              <ContactDetail icon={<BsClock size={18} />} content="Lun a Vie: 09:00 - 19:00 | Sáb: 09:00 - 13:00" />
            </div>
          </div>

          <nav className="flex flex-col space-y-4 items-center sm:items-start lg:items-center">
            <h4 className="text-s font-light tracking-wide uppercase">Sin funcionamiento, no presionar</h4>
            <FooterLink href="/Legales/avisoLegal" label="Aviso Legal" active={isActive('/Legales/avisoLegal')} />
            <FooterLink href="/Legales/politicaPrivacidad" label="Política de Privacidad" active={isActive('/Legales/politicaPrivacidad')} />
            <FooterLink href="/Legales/terminosYCondiciones" label="Términos y Condiciones" active={isActive('/Legales/terminosYCondiciones')} />
          </nav>

          <nav className="flex flex-col space-y-4 items-center sm:items-start lg:items-center">
            <FooterLink href="/" label="Inicio" active={isActive('/')} />
            <FooterLink href="/Vehiculos" label="Vehículos" active={isActive('/Vehiculos')} />
            <FooterLink href="/SobreNosotros" label="Sobre nosotros" active={isActive('/SobreNosotros')} />
            <FooterLink href="/Contacto" label="Contacto" active={isActive('/Contacto')} />
          </nav>

          <div className="flex flex-col items-center sm:items-start lg:items-end space-y-6">
            <Link href="https://instagram.com" 
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <FaInstagram size={24} /> 
              <span className="font-light">Parisimotors</span>
            </Link>

            <Link href="https://facebook.com" 
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <LiaFacebookSquare size={24} /> 
              <span className="font-light">Parisi Motors</span>
            </Link>

            <Link href="https://x.com" 
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <SiX size={24} /> 
              <span className="font-light">Parisi_motors</span>
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

function ContactDetail({ icon, content }: { icon: React.ReactNode, content: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-white shrink-0">{icon}</div>
      <p className="text-gray-300 font-light text-sm">{content}</p>
    </div>
  );
}