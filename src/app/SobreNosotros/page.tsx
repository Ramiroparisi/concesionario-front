'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BsShieldCheck, BsStar, BsPeople } from "react-icons/bs";
import { fondo_sobreNosotros } from '@/assets/images';
import { sobreNosotros } from '@/assets/images';

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-900 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${fondo_sobreNosotros.src}')` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-widest uppercase mb-4">
            Nuestra Historia
          </h1>
          <div className="w-24 h-1 bg-white mx-auto opacity-70"></div>
        </div>
      </div>

      <main className="flex-1 w-full">
        
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-normal text-gray-900 mb-8 uppercase tracking-widest">
                Pasión por la excelencia
              </h2>
              <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                <p>
                  Desde nuestros inicios, en Parisi Motors nos hemos dedicado a redefinir la experiencia de adquirir un vehículo. No solo vendemos autos; conectamos a las personas con el vehículo de sus sueños, asegurando un proceso transparente, ágil y de máxima calidad.
                </p>
                <p>
                  Ubicados estratégicamente en Rosario, nuestro equipo de expertos trabaja incansablemente para seleccionar las mejores unidades del mercado. Cada vehículo que ingresa a nuestro salón pasa por rigurosos controles de calidad para garantizar la tranquilidad total de nuestros clientes.
                </p>
                <p>
                  Entendemos que comprar un auto es una decisión importante. Por eso, nuestro compromiso es brindarte un asesoramiento honesto y personalizado, acompañándote antes, durante y mucho después de que salgas manejando.
                </p>
              </div>
            </div>
            
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-gray-200">
              <img 
                src={sobreNosotros.src} 
                alt="Nuestros vehiculos" 
                className="w-full h-full object-cover"/>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-normal text-gray-900 mb-16 uppercase tracking-widest text-center">
              Nuestros Pilares
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <BsShieldCheck size={32} className="text-black" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 uppercase tracking-wider mb-4">
                  Confianza Absoluta
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Transparencia total en cada gestión. Documentación al día y vehículos con historiales verificados para que tu única preocupación sea disfrutar del camino.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <BsStar size={32} className="text-black" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 uppercase tracking-wider mb-4">
                  Calidad Premium
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Seleccionamos meticulosamente nuestro inventario. Trabajamos con las marcas más prestigiosas y garantizamos un estándar de calidad superior en cada unidad.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <BsPeople size={32} className="text-black" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 uppercase tracking-wider mb-4">
                  Atención Dedicada
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Construimos relaciones a largo plazo. Nuestro equipo está a tu disposición para ofrecerte soluciones a medida y un servicio de posventa excepcional.
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="bg-gray-700 text-white py-24 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-light tracking-widest uppercase mb-6">
              Vení a conocernos
            </h2>
            <p className="font-light text-gray-400 mb-10 leading-relaxed">
              Te esperamos en nuestro Concesionario para que descubras tu próximo vehículo. Nuestro equipo está listo para recibirte y brindarte la mejor experiencia.
            </p>
            <a 
              href="/Contacto" 
              className="inline-block px-10 py-4 bg-white text-black font-medium tracking-widest uppercase transition-colors duration-300 hover:bg-gray-200"
            >
              Contactar a un asesor
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}