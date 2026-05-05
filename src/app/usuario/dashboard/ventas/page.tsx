'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { getVehiculos } from '@/services/vehiculoService';
import Link from 'next/link';

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
  marca: Marca; 
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
  estado: string;
  modelo: Modelo; 
  multimedia: Multimedia[];
}


export default function VehiculosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [busqueda, setBusqueda] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [modeloFiltro, setModeloFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        try {
          const authRes = await api.get('/auth/verify-token');
          const rol = authRes.data.user?.rol;
          
          if (rol !== 'Admin' && rol !== 'Empleado') {
            router.push('/usuario/login');
            return;
          }
        } catch (authError) {
          router.push('/usuario/login');
          return;
        }

        const ven = await api.get('/vehiculos');
        const vehiculosVendidos = ven.data.data.filter((v: Vehiculo) => 
          v.estado === 'Vendido'
        );
        setVehiculos(vehiculosVendidos);

      } catch (err) {
        setError('No se pudieron cargar los vehículos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    
    fetchDatos();
  }, [router]);

  const marcasDisponibles = Array.from(
    new Set(vehiculos.map(v => typeof v.modelo === 'object' && typeof v.modelo.marca === 'object' ? v.modelo.marca.nombre : 'Sin Marca'))
  );

  const modelosDisponibles = Array.from(
    new Set(
      vehiculos
        .filter(v => marcaFiltro === '' || (typeof v.modelo.marca === 'object' ? v.modelo.marca.nombre : v.modelo.marca) === marcaFiltro)
        .map(v => typeof v.modelo === 'object' ? v.modelo.nombre : v.modelo)
    )
  );

  const estadosDisponibles = Array.from(
    new Set(vehiculos.map(v => v.estado))
  );

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const nombreMarca = typeof vehiculo.modelo.marca === 'object' ? vehiculo.modelo.marca.nombre : (vehiculo.modelo.marca as string);
    const nombreModelo = typeof vehiculo.modelo === 'object' ? vehiculo.modelo.nombre : (vehiculo.modelo as string);
    const textoBusqueda = busqueda.toLowerCase();
    
    const coincideBusqueda = 
      vehiculo.patente?.toLowerCase().includes(textoBusqueda) || 
      nombreModelo?.toLowerCase().includes(textoBusqueda);
    
    const coincideMarca = marcaFiltro === '' || nombreMarca === marcaFiltro;
    const coincideModelo = modeloFiltro === '' || nombreModelo === modeloFiltro;
    const coincideEstado = estadoFiltro === '' || vehiculo.estado === estadoFiltro;

    return coincideBusqueda && coincideMarca && coincideModelo && coincideEstado;
  });

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} /> 
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8">

        <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="relative z-[60] md:z-auto"> 
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-colors border border-gray-700 shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">
              Gestión de Ventas
            </h1>
          </div>
  
        </header>

        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <input
              type="text"
              placeholder="Buscar patente o modelo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white shadow-sm"
            />
            
            <select
              value={marcaFiltro}
              onChange={(e) => {
                setMarcaFiltro(e.target.value);
                setModeloFiltro('');
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white shadow-sm"
            >
              <option value="">Todas las marcas</option>
              {marcasDisponibles.map((marca, index) => (
                <option key={`marca-${index}`} value={marca}>{marca}</option>
              ))}
            </select>

            <select
              value={modeloFiltro}
              onChange={(e) => setModeloFiltro(e.target.value)}
              disabled={!marcaFiltro}
              className={`px-4 py-3 rounded-xl border outline-none text-gray-800 shadow-sm transition-colors ${
                !marcaFiltro ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' : 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <option value="">Todos los modelos</option>
              {modelosDisponibles.map((modelo, index) => (
                <option key={`modelo-${index}`} value={modelo}>{modelo}</option>
              ))}
            </select>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white shadow-sm"
            >
              <option value="">Todos los estados</option>
              {estadosDisponibles.map((estado, index) => (
                <option key={`estado-${index}`} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        )}

        {cargando ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 text-center font-medium rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {vehiculosFiltrados.length > 0 ? (
              vehiculosFiltrados.map((vehiculo) => {
              const nombreMarca = typeof vehiculo.modelo === 'object' && typeof vehiculo.modelo.marca === 'object' ? vehiculo.modelo.marca.nombre : 'Sin Marca';
              const nombreModelo = typeof vehiculo.modelo === 'object' ? vehiculo.modelo.nombre : vehiculo.modelo;
              const fotoPortada = vehiculo.multimedia && vehiculo.multimedia.length > 0 ? `http://localhost:3000/uploads/${vehiculo.multimedia[0].archivo}` : null;

                return (
                  <Link 
                    href={`/usuario/dashboard/vehiculos/${vehiculo.id}`} 
                    key={vehiculo.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
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

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">
                        {nombreMarca}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {nombreModelo}
                      </h3>
                      <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">
                        {vehiculo.anio?.toLocaleString('es-AR')} | {vehiculo.kilometraje?.toLocaleString('es-AR')}km
                      </span>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-2xl font-black text-gray-900">
                          ${vehiculo.precio?.toLocaleString('es-AR')}
                        </span>

                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>  
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron vehículos</h3>
                <p className="text-gray-500">
                  {vehiculos.length === 0 
                    ? "Aún no has registrado ningún vehículo en el sistema." 
                    : "Intenta ajustando los filtros de búsqueda."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}