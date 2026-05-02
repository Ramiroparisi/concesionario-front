'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BsEnvelope, BsTelephone, BsGeoAlt, BsClock } from "react-icons/bs";

export default function ContactoPage() {
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/xjglknqj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('SUCCESS');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="bg-gray-900 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-widest uppercase mb-4">
          Contacto
        </h1>
        <p className="text-gray-400 font-light tracking-wide">Estamos aquí para asesorarte en tu próxima inversión.</p>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-normal text-gray-900 mb-8 uppercase tracking-widest">
                Información de contacto
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-10">
                Visítanos en nuestro concesionario en Rosario o contactanos por cualquiera de nuestros canales oficiales.
              </p>
            </div>

            <div className="space-y-8">
              <ContactDetail icon={<BsGeoAlt size={24} />} title="Ubicación" content="E. Zeballos 1341, Rosario, Santa Fe" />
              <ContactDetail icon={<BsTelephone size={24} />} title="Teléfono" content="+54 341 393-2240" />
              <ContactDetail icon={<BsEnvelope size={24} />} title="Email" content="parisimotors@gmail.com" />
              <ContactDetail icon={<BsClock size={24} />} title="Horarios" content="Lun a Vie: 09:00 - 19:00 | Sáb: 09:00 - 13:00" />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
            {status === 'SUCCESS' ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-light text-green-600 mb-4 uppercase tracking-widest">¡Gracias por escribirnos!</h3>
                <p className="text-gray-500 font-light">Hemos recibido tu mensaje, un asesor de Parisi Motors te contactará a la brevedad.</p>
                <button onClick={() => setStatus('IDLE')} className="mt-8 text-sm uppercase tracking-widest border-b border-black pb-1">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Nombre y apellido</label>
                  <input 
                    name="nombre"
                    required
                    type="text" 
                    className="w-full px-2 py-3 bg-transparent border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    className="w-full px-2 py-3 bg-transparent border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Mensaje</label>
                  <textarea 
                    name="mensaje"
                    required
                    rows={4}
                    className="w-full px-2 py-3 bg-transparent border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900 resize-none"
                  ></textarea>
                </div>

                {status === 'ERROR' && (
                  <p className="text-red-500 text-xs italic">Ocurrió un error. Por favor, intenta nuevamente.</p>
                )}

                <button 
                  type="submit"
                  disabled={enviando}
                  className="w-full py-4 bg-black text-white text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-gray-800 disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ContactDetail({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex items-start gap-5">
      <div className="text-black mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-gray-500 font-light text-sm">{content}</p>
      </div>
    </div>
  );
}