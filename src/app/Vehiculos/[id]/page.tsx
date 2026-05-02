'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVehiculoById } from '@/services/vehiculoService';
import { BsSpeedometer2, BsCalendarDate, BsTags, BsFuelPump, BsDoorOpen } from "react-icons/bs";
import { IoColorPaletteOutline } from "react-icons/io5";
import { TbFileDescription, TbEngine, TbManualGearbox } from "react-icons/tb";

interface Marca { 
  id: number;
  nombre: string;
}

interface Modelo { 
  id: number; 
  nombre: string; 
  marca: Marca;
  motor?: string;
  transmision?: string;
  combustible?: string;
  puertas?: number;
}

interface Multimedia { 
  id: number; 
  archivo: string;
}

interface Vehiculo {
  id: number;
  patente: string;
  precio: number;
  anio: number;
  kilometraje: number;
  color: string;
  descripcion: string;
  estado: string;
  modelo: Modelo; 
  multimedia: Multimedia[];
}

export default function VehiculoDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [imagenActiva, setImagenActiva] = useState<string | null>(null);
  const [mostrarTodasCaract, setMostrarTodasCaract] = useState(false);

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        setCargando(true);
        const idNumero = Number(id);

        if (isNaN(idNumero)) {
          setError('El ID del vehículo no es válido.');
          setCargando(false);
          return;
        }
        
        const data = await getVehiculoById(idNumero);
        setVehiculo(data);
        
        if (data.multimedia && data.multimedia.length > 0) {
          setImagenActiva(`http://localhost:3000/uploads/${data.multimedia[0].archivo}`);
        }
      } catch (err) {
        setError('No se pudo cargar la información del vehículo.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      fetchVehiculo();
    }
  }, [id]);

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
          <p className="text-xl font-light text-gray-900 uppercase tracking-widest mb-4">Vehículo no encontrado</p>
          <Link href="/vehiculos" className="text-sm border-b border-black pb-1 hover:text-gray-600 transition-colors">
            Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nombreMarca = vehiculo.modelo?.marca?.nombre || 'Sin Marca';
  const nombreModelo = vehiculo.modelo?.nombre || 'Sin Modelo';
  const esReservable = vehiculo.estado === 'Disponible';

  const listaCaracteristicas = [
    { icon: <BsCalendarDate size={24}/>, label: "Año", valor: vehiculo.anio.toString() },
    { icon: <BsSpeedometer2 size={24}/>, label: "Kilometraje", valor: `${vehiculo.kilometraje.toLocaleString('es-AR')} km` },
    { icon: <IoColorPaletteOutline size={24}/>, label: "Color", valor: vehiculo.color },
    { icon: <BsTags size={24}/>, label: "Patente", valor: vehiculo.patente },
    { icon: <TbEngine size={24}/>, label: "Motor", valor: vehiculo.modelo?.motor || 'No especificado' },
    { icon: <TbManualGearbox size={24}/>, label: "Transmisión", valor: vehiculo.modelo?.transmision || 'No especificada' },
    { icon: <BsFuelPump size={24}/>, label: "Combustible", valor: vehiculo.modelo?.combustible || 'No especificado' },
    { icon: <BsDoorOpen size={24}/>, label: "Puertas", valor: vehiculo.modelo?.puertas?.toString() || 'No especificadas' },
    { icon: <TbFileDescription size={24}/>, label: "Descripción", valor: vehiculo.descripcion }
  ];

  const caracteristicasVisibles = mostrarTodasCaract 
    ? listaCaracteristicas 
    : listaCaracteristicas.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        
        <div className="mb-8">
          <Link href="/Vehiculos" className="text-sm text-black font-light hover:text-gray-600 transition-colors">
           Volver a vehículos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="flex flex-col space-y-4">
            <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
              {imagenActiva ? (
                <img 
                  src={imagenActiva} 
                  alt={`${nombreMarca} ${nombreModelo}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="font-light tracking-widest uppercase">Sin imagen</span>
                </div>
              )}
              
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest shadow-md ${
                  vehiculo.estado === 'Disponible' ? 'bg-green-500 text-white' : 
                  vehiculo.estado === 'Reservado' ? 'bg-yellow-400 text-gray-900' : 
                  'bg-red-500 text-white'
                }`}>
                  {vehiculo.estado}
                </span>
              </div>
            </div>

            {vehiculo.multimedia && vehiculo.multimedia.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {vehiculo.multimedia.map((media) => {
                  const url = `http://localhost:3000/uploads/${media.archivo}`;
                  return (
                    <button 
                      key={media.id}
                      onClick={() => setImagenActiva(url)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        imagenActiva === url ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start">
            
            <div className="mb-10 pb-10 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-[0.3em] mb-2">
                {nombreMarca}
              </h2>
              <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">
                {nombreModelo}
              </h1>
              <div className="text-4xl font-light text-black">
                US$ {vehiculo.precio?.toLocaleString('es-AR')}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-lg font-medium text-gray-900 uppercase tracking-widest mb-6">
                Características y Equipamiento
              </h3>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-6">
                {caracteristicasVisibles.map((caract, index) => (
                  <Caracteristica 
                    key={index} 
                    icon={caract.icon} 
                    label={caract.label} 
                    valor={caract.valor} 
                  />
                ))}
              </div>

              {listaCaracteristicas.length > 6 && (
                <button 
                  onClick={() => setMostrarTodasCaract(!mostrarTodasCaract)}
                  className="text-sm font-medium text-black uppercase tracking-widest border-b border-black pb-1 transition-opacity hover:opacity-60"
                >
                  {mostrarTodasCaract ? '- Ver menos' : '+ Ver más características'}
                </button>
              )}
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl text-white mt-auto">
              <h4 className="text-xl font-light uppercase tracking-widest mb-3">
                ¿Te interesa esta unidad?
              </h4>
              <p className="text-gray-400 font-light text-sm mb-8 leading-relaxed">
                Asegurá este vehículo realizando una seña de forma segura. El auto quedará reservado a tu nombre. Las reservas duran 21 días, luego de eso la seña le pertenece al concesionario.
              </p>
              
              {esReservable ? (
                <Link 
                  href={`/Vehiculos/${vehiculo.id}/Reservar`}
                  className="block w-full py-4 bg-white text-black text-center text-sm font-medium uppercase tracking-[0.2em] transition-all hover:bg-gray-200"
                >
                  Iniciar Reserva
                </Link>
              ) : (
                <button 
                  disabled
                  className="block w-full py-4 bg-gray-800 text-gray-500 text-center text-sm font-medium uppercase tracking-[0.2em] cursor-not-allowed"
                >
                  Vehículo no disponible
                </button>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


function Caracteristica({ icon, label, valor }: { icon: React.ReactNode, label: string, valor: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-gray-400 mt-1">
        {icon}
      </div>
      <div className="flex-1 pr-2">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base text-gray-900 font-medium break-words whitespace-pre-line">{valor}</p>
      </div>
    </div>
  );
}