'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVehiculoById } from '@/services/vehiculoService';

interface Marca { id: number; nombre: string; }
interface Modelo { id: number; nombre: string; marca: Marca; }
interface Multimedia { id: number; archivo: string; }
interface Vehiculo {
  id: number;
  patente: string;
  precio: number;
  anio: number;
  kilometraje: number;
  estado: string;
  modelo: Modelo; 
  multimedia: Multimedia[];
}

export default function ReservarVehiculoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [error, setError] = useState('');
  const [nombreCli, setNombreCli] = useState('');
  const [apellidoCli, setApellidoCli] = useState('');
  const [dni, setDni] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const idNumero = Number(id);
        if (isNaN(idNumero)) {
          setError('El ID del vehículo no es válido.');
          setCargando(false);
          return;
        }
        
        const data = await getVehiculoById(idNumero);
        if (data.estado !== 'Disponible') {
          router.push('/vehiculos');
          return;
        }

        setVehiculo(data);
      } catch (err) {
        setError('No se pudo cargar la información del vehículo.');
      } finally {
        setCargando(false);
      }
    };

    if (id) fetchVehiculo();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesandoPago(true);

    const importeSenia = 100;

    const reservaData = {
      vehiculo_id: vehiculo?.id,
      nombreCli,
      apellidoCli,
      dni,
      mail,
      telefono,
      importe: importeSenia
    };

    try {
      /* 
        AQUÍ VA LA LÓGICA DE MERCADO PAGO:
        1. Envías 'reservaData' a tu backend (Node.js/Spring Boot, etc).
        2. Tu backend guarda la reserva en estado "Pendiente/Activa".
        3. Tu backend se comunica con la API de Mercado Pago y crea una "Preferencia".
        4. Tu backend te devuelve el 'init_point' (la URL de pago de MP).
        5. Rediriges al usuario a esa URL.
      */

      console.log('Enviando datos al backend para crear preferencia de MP...', reservaData);
      
      setTimeout(() => {
        alert('Redirigiendo a Mercado Pago... (Implementar integración)');
        setProcesandoPago(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar la reserva.');
      setProcesandoPago(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vehiculo) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <p className="text-xl font-light text-gray-900 uppercase tracking-widest mb-4">{error || 'Vehículo no encontrado'}</p>
          <Link href="/vehiculos" className="text-sm border-b border-black pb-1 hover:text-gray-600">Volver al catálogo</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nombreMarca = vehiculo.modelo?.marca?.nombre || 'Sin Marca';
  const nombreModelo = vehiculo.modelo?.nombre || 'Sin Modelo';
  const fotoPortada = vehiculo.multimedia && vehiculo.multimedia.length > 0 ? `http://localhost:3000/uploads/${vehiculo.multimedia[0].archivo}` : null;
  const IMPORTE_SENA = 100; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="bg-gray-900 py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-widest uppercase mb-2">
          Reserva de Unidad
        </h1>
        <p className="text-gray-400 font-light tracking-wide text-sm">Estás a un paso de asegurar tu próximo vehículo.</p>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-8">
          <Link href={`/Vehiculos/${vehiculo.id}`} className="text-sm text-black font-light hover:text-gray-600 transition-colors">
            Volver a los detalles del vehículo
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
              Resumen de la operación
            </h3>
            
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden mb-6 relative">
              {fotoPortada ? (
                <img src={fotoPortada} alt={nombreModelo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">Sin imagen</div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{nombreMarca}</p>
              <p className="text-2xl font-medium text-gray-900">{nombreModelo}</p>
              <p className="text-sm text-gray-500 font-light mt-1">Año {vehiculo.anio} | {vehiculo.patente}</p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex justify-between items-center text-gray-600 font-light">
                <span>Precio del vehículo</span>
                <span>US$ {vehiculo.precio.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-medium text-black">
                <span>Total a señar hoy</span>
                <span>ARS$ {IMPORTE_SENA.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">
            <h2 className="text-2xl font-normal text-gray-900 mb-8 uppercase tracking-widest">
              Tus Datos
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Nombre</label>
                  <input 
                    required type="text" 
                    value={nombreCli} onChange={(e) => setNombreCli(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Apellido</label>
                  <input 
                    required type="text" 
                    value={apellidoCli} onChange={(e) => setApellidoCli(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">DNI</label>
                  <input 
                    required type="text" 
                    value={dni} onChange={(e) => setDni(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Teléfono</label>
                  <input 
                    required type="tel" 
                    value={telefono} onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                <input 
                  required type="email" 
                  value={mail} onChange={(e) => setMail(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-400 rounded-[10px] focus:border-black outline-none transition-colors font-light text-gray-900"
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-light mb-6 leading-relaxed">
                  Al hacer clic en Pagar seña, serás redirigido a la plataforma segura de Mercado Pago para completar la operación. La seña asegura la reserva del vehículo a tu nombre y bloquea la disponibilidad para otros usuarios.
                </p>
                <button 
                  type="submit"
                  disabled={procesandoPago}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#009EE3] text-white text-sm font-medium uppercase tracking-widest transition-all hover:bg-[#0088C3] disabled:opacity-70 rounded-md"
                >
                  {procesandoPago ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current">
                        <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm-3 58L32 53l5.6-5.6 9.4 9.4 25.4-25.4L78 37 47 68z"/>
                      </svg>
                      Pagar seña con Mercado Pago
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}