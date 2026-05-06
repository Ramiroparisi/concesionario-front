'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { getModelos, deleteModelo } from '@/services/modeloService';
import Link from 'next/link'; 

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
  marca: Marca;
  cantPuertas: number;
  combustible: string;
  motor: string;
  potencia: number;
  transmision: string;
}

export default function ModelosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [busqueda, setBusqueda] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  
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
        } catch {
          router.push('/usuario/login');
          return;
        }

        const data = await getModelos();
        setModelos(data); 

      } catch (error) {
        setError('No se pudieron cargar los modelos');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    
    fetchDatos();
  }, [router]);

  const handleEliminar = async (id: number, nombreModelo: string) => {
    const confirmacion = window.confirm(`¿Estás seguro que deseas eliminar el modelo "${nombreModelo}"?`);
    
    if (confirmacion) {
      try {
        await deleteModelo(id);
        setModelos(modelos.filter((modelo) => modelo.id !== id));
      } catch {
        alert('Hubo un error al intentar eliminar el modelo. Verifica que no tenga vehículos asociados.');
      }
    }
  };  

  const marcasDisponibles = Array.from(
    new Set(modelos.map(m => typeof m.marca === 'object' ? m.marca.nombre : m.marca))
  ).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

  const modelosFiltrados = modelos.filter((modelo) => {
    const nombreModelo = modelo.nombre.toLowerCase();
    const nombreMarca = typeof modelo.marca === 'object' ? modelo.marca.nombre : (modelo.marca as string);
    
    const coincideBusqueda = nombreModelo.includes(busqueda.toLowerCase());
    const coincideMarca = marcaFiltro === '' || nombreMarca === marcaFiltro;

    return coincideBusqueda && coincideMarca;
  }).sort((a, b) => a.marca.nombre.localeCompare(b.marca.nombre, 'es', { sensitivity: 'base' }));

  return (
    <div className="flex bg-gray-900 overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} /> 
      
      <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8">

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
              Gestión de Modelos
            </h1>
          </div>
          
          <Link href="/usuario/dashboard/modelos/nuevoModelo" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-900/20">
            Nuevo Modelo
          </Link>
        </header>

        {!cargando && !error && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre de modelo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white shadow-sm"
            />
            <select
              value={marcaFiltro}
              onChange={(e) => setMarcaFiltro(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white shadow-sm sm:w-64"
            >
              <option value="">Todas las marcas</option>
              {marcasDisponibles.map((marca, index) => (
                <option key={index} value={marca}>{marca}</option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {cargando ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-6 text-center font-medium">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-500 border-b border-gray-700 text-white">
                  <tr>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold text-center">Marca</th>
                    <th className="p-4 font-semibold text-center">Cantidad de puertas</th>
                  <th className="p-4 font-semibold text-center">Combustible</th>
                  <th className="p-4 font-semibold text-center">Motor</th>
                  <th className="p-4 font-semibold text-center">Potencia (CV)</th>
                  <th className="p-4 font-semibold text-center">Transmisión</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                  {modelosFiltrados.length > 0 ? (
                    modelosFiltrados.map((modelo) => (
                      <tr key={modelo.id} className="border-b text-gray-800 border-gray-200 hover:bg-gray-300 transition-colors">
                        <td className="p-4 font-medium">{modelo.nombre}</td>
                        <td className="p-4 text-center">{typeof modelo.marca === 'object' ? modelo.marca.nombre : modelo.marca}</td>                        
                        <td className="p-4 text-center">{modelo.cantPuertas}</td>
                        <td className="p-4 text-center">{modelo.combustible}</td>
                        <td className="p-4 text-center">{modelo.motor}</td>
                        <td className="p-4 text-center">{modelo.potencia}</td>
                        <td className="p-4 text-center">{modelo.transmision}</td>
                        <td className="p-4">
                         <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          <Link 
                            href={`/usuario/dashboard/modelos/${modelo.id}`} 
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm">
                            Editar
                          </Link>
                          <button 
                            onClick={() => handleEliminar(modelo.id, modelo.nombre)} 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors font-medium text-sm">
                             Eliminar
                          </button>
                         </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        {modelos.length === 0 
                          ? "No hay modelos registrados todavía." 
                          : "No se encontraron modelos con esos filtros."}
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
          )}
        </div>
        
      </main>
    </div>
  );
}