'use client';

import { useEffect, useState } from 'react';
import { getVehiculos } from '@/services/vehiculoService';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { pagina_principal } from '@/assets/images';
import Footer from '@/components/Footer';
import { SiBmw } from "react-icons/si";
import { TbBrandMercedes } from "react-icons/tb";
import { MBLogo } from '@cardog-icons/react';
import { SiAlfaromeo } from "react-icons/si";
import { GoGear } from "react-icons/go";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { PiHandEye } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";

interface Marca { 
  id: number; 
  nombre: string; 
}
interface Modelo { id: number; 
  nombre: string; 
  marca: Marca; 
}
interface Multimedia { id: number;
  archivo: string; 
  }

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

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [busqueda, setBusqueda] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [modeloFiltro, setModeloFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [cantidadVisible, setCantidadVisible] = useState(4);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await getVehiculos();
        setVehiculos(data); 
      } catch (err) {
        setError('No se pudieron cargar los vehículos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

const [currentService, setCurrentService] = useState(0);

  const servicios = [
    {
      title: "Servicio técnico oficial",
      icon: <GoGear size={48} />,
      content: "Nuestros talleres cuentan con la certificación y las herramientas originales de fábrica. Cada reparación es realizada por técnicos especializados que conocen tu vehículo como nadie más, garantizando la seguridad, el rendimiento y la durabilidad a largo plazo."
    },
    {
      title: "Atención personalizada",
      icon: <BsFillPersonCheckFill size={48} />,
      content: "Desde la primera consulta hasta el servicio posventa, un asesor dedicado te acompañará en cada paso. Nuestros vendedores están altamente capacitados para entender tus necesidades y guiarte hacia el vehículo perfecto para vos."
    },
    {
      title: "Recepción Activa",
      icon: <PiHandEye size={48} />,
      content: "En Parisi Motors, valoramos tu tiempo. La recepción activa es un servicio que te permite interactuar directamente. Juntos, podemos revisar el estado del auto, diagnosticar posibles problemas y acordar los trabajos a realizar."
    },
    {
      title: "Gestión y patentamiento",
      icon: <FaCheckCircle size={48} />,
      content: "Simplificamos el proceso de compra. Nuestro equipo de gestoría se encarga de todo el trámite de patentamiento y documentación por vos. Así, podés disfrutar de tu nuevo vehículo sin demoras ni preocupaciones adicionales."
    }
  ];
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentService(index);
  };

  const marcasDisponibles = Array.from(new Set(vehiculos.map(v => typeof v.modelo === 'object' && typeof v.modelo.marca === 'object' ? v.modelo.marca.nombre : 'Sin Marca')));
  const modelosDisponibles = Array.from(new Set(vehiculos.filter(v => marcaFiltro === '' || (typeof v.modelo.marca === 'object' ? v.modelo.marca.nombre : v.modelo.marca) === marcaFiltro).map(v => typeof v.modelo === 'object' ? v.modelo.nombre : v.modelo)));
  const estadosDisponibles = Array.from(new Set(vehiculos.map(v => v.estado)));

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const nombreMarca = typeof vehiculo.modelo.marca === 'object' ? vehiculo.modelo.marca.nombre : (vehiculo.modelo.marca as string);
    const nombreModelo = typeof vehiculo.modelo === 'object' ? vehiculo.modelo.nombre : (vehiculo.modelo as string);
    const textoBusqueda = busqueda.toLowerCase();
    
    const coincideBusqueda = vehiculo.patente?.toLowerCase().includes(textoBusqueda) || nombreModelo?.toLowerCase().includes(textoBusqueda);
    const coincideMarca = marcaFiltro === '' || nombreMarca === marcaFiltro;
    const coincideModelo = modeloFiltro === '' || nombreModelo === modeloFiltro;
    const coincideEstado = estadoFiltro === '' || vehiculo.estado === estadoFiltro;
    const min = precioMin === '' ? 0 : parseFloat(precioMin);
    const max = precioMax === '' ? Infinity : parseFloat(precioMax);
    const coincidePrecio = vehiculo.precio >= min && vehiculo.precio <= max;

    return coincideBusqueda && coincideMarca && coincideModelo && coincideEstado && coincidePrecio;
  });

  const vehiculosPaginados = vehiculosFiltrados.slice(0, cantidadVisible);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <Header />
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pagina_principal.src})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>


      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-24 py-12 md:py-24 px-6">
        <p className="text-gray-900 hover:text-gray-400 transition-colors">
          <SiBmw className="w-18 h-18 md:w-[220px] md:h-[220px]" /> 
        </p>


          <div className="w-32 h-32 md:w-[420px] md:h-[420px] flex items-center justify-center">        
            <p className="text-gray-900 hover:text-gray-400 transition-colors">
            <MBLogo width="100%" height="100%" /> 
            </p>
          </div>

    
        <p className="text-gray-900 hover:text-gray-400 transition-colors">
          <SiAlfaromeo className="w-18 h-18 md:w-[220px] md:h-[220px]"/>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 w-full">
        <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-12">
          Nuestros servicios
        </h2>

        <div className="relative group">
          <div 
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10"
          >
            {servicios.map((servicio, index) => (
              <div 
                key={index}
                className="min-w-full md:min-w-0 snap-center bg-white p-10 rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-start text-left min-h-[450px] border border-gray-50"
              >
                <div className="mb-8 text-black">
                  {servicio.icon}
                </div>
                <h3 className="text-3xl font-medium text-gray-900 leading-tight mb-6">
                  {servicio.title}
                </h3>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  {servicio.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 mt-4 md:hidden">
            {servicios.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  currentService === index ? 'bg-gray-800 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        
        <h2 className="text-3xl font-light text-gray-900 mb-8 uppercase tracking-widest text-center">
          Nuestros vehículos
        </h2>

        {!cargando && !error && (
          <div className="flex flex-col gap-8 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Buscar modelo"
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setCantidadVisible(20); }}
                className="px-4 py-3 rounded-none border-b border-gray-400 focus:border-black outline-none text-gray-800 bg-transparent transition-colors font-light" 
              />

              <select
                value={marcaFiltro}
                onChange={(e) => { setMarcaFiltro(e.target.value); setModeloFiltro(''); setCantidadVisible(20); }}
                className="px-4 py-3 rounded-none border-b border-gray-400 focus:border-black outline-none text-gray-800 bg-transparent transition-colors appearance-none font-light">
                <option value="">Todas las marcas</option>
                {marcasDisponibles.map((marca, index) => (
                  <option key={`marca-${index}`} value={marca}>{marca}</option>
                ))}
              </select>

              <select
                value={modeloFiltro}
                onChange={(e) => { setModeloFiltro(e.target.value); setCantidadVisible(20); }}
                disabled={!marcaFiltro}
                className={`px-4 py-3 rounded-none border-b border-gray-400 focus:border-black outline-none transition-colors appearance-none font-light ${!marcaFiltro ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-transparent' : 'border-gray-300 focus:border-black text-gray-800 bg-transparent'}`}>
                <option value="">Todos los modelos</option>
                {modelosDisponibles.map((modelo, index) => (
                  <option key={`modelo-${index}`} value={modelo}>{modelo}</option>
                ))}
              </select>

              <select
                value={estadoFiltro}
                onChange={(e) => { setEstadoFiltro(e.target.value); setCantidadVisible(20); }}
                className="px-4 py-3 rounded-none border-b border-gray-400 focus:border-black outline-none text-gray-800 bg-transparent transition-colors appearance-none font-light">
                <option value="">Todos los estados</option>
                {estadosDisponibles.map((estado, index) => (
                  <option key={`estado-${index}`} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Rango de precio (US$)</span>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={precioMin}
                  onChange={(e) => { setPrecioMin(e.target.value); setCantidadVisible(20); }}
                  className="w-full sm:w-32 px-4 py-2 rounded-none border border-gray-400 focus:border-black outline-none text-gray-800 bg-transparent transition-colors text-sm font-light"
                />
                <span className="text-gray-300">—</span>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={precioMax}
                  onChange={(e) => { setPrecioMax(e.target.value); setCantidadVisible(20); }}
                  className="w-full sm:w-32 px-4 py-2 rounded-none border border-gray-400 focus:border-black outline-none text-gray-800 bg-transparent transition-colors text-sm font-light"
                />
              </div>
              
              {(precioMin || precioMax) && (
                <button 
                  onClick={() => { setPrecioMin(''); setPrecioMax(''); }}
                  className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Limpiar precio
                </button>
              )}
            </div>
          </div>
        )}

        {cargando ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 text-center font-medium">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {vehiculosPaginados.length > 0 ? (
                vehiculosPaginados.map((vehiculo) => {
                  const nombreMarca = typeof vehiculo.modelo === 'object' && typeof vehiculo.modelo.marca === 'object' ? vehiculo.modelo.marca.nombre : 'Sin Marca';
                  const nombreModelo = typeof vehiculo.modelo === 'object' ? vehiculo.modelo.nombre : vehiculo.modelo;
                  const fotoPortada = vehiculo.multimedia && vehiculo.multimedia.length > 0 ? `http://localhost:3000/uploads/${vehiculo.multimedia[0].archivo}` : null;

                  return (
                    <Link
                      href={`/Vehiculos/${vehiculo.id}`}
                      key={vehiculo.id}
                      className="bg-white overflow-hidden group cursor-pointer flex flex-col border border-gray-500 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="h-52 w-full bg-gray-100 relative overflow-hidden">
                        {fotoPortada ? (
                          <img 
                            src={fotoPortada} 
                            alt={`${nombreMarca} ${nombreModelo}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">Sin imagen</span>
                          </div>
                        )}
                        
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                            vehiculo.estado === 'Disponible' ? 'bg-green-500 text-white' : 
                            vehiculo.estado === 'Reservado' ? 'bg-yellow-400 text-gray-900' : 
                            'bg-red-500 text-white'
                          }`}>
                            {vehiculo.estado}
                          </span>
                        </div>
                      </div>

                      <div className="py-5 flex flex-col flex-1 text-center">
                        <p className="text-xs text-gray-800 font-light mb-1 uppercase tracking-widest">
                          {nombreMarca}
                        </p>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {nombreModelo}
                        </h3>
                        <span className="text-sm text-gray-600 font-light mb-4">
                          {vehiculo.anio} | {vehiculo.kilometraje?.toLocaleString('es-AR')} km
                        </span>
                        
                        <div className="mt-auto">
                          <span className="text-xl font-normal text-gray-900">
                            US$ {vehiculo.precio?.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 text-lg font-light uppercase tracking-widest">
                    No se encontraron vehículos.
                  </p>
                </div>
              )}
            </div>

            {cantidadVisible < vehiculosFiltrados.length && (
              <div className="flex justify-center mt-4 mb-12">
                <button
                  onClick={() => setCantidadVisible(prev => prev + 4)}
                  className="px-8 py-3 border border-black text-black font-light tracking-widest uppercase transition-colors duration-300 hover:bg-black hover:text-white"
                >
                  Cargar más
                </button>
              </div>
            )}
          </>
        )}
      </main>
     <Footer /> 
    </div>
  );
}