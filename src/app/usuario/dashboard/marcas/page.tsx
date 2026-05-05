'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link.js';
import { useState, useEffect } from 'react';
import { getMarcas, deleteMarca } from '@/services/marcaService';

interface Marca {
  id: number;
  nombre: string;
}

export default function MarcasPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
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

        const data = await getMarcas();
        setMarcas(data); 

      } catch (err) {
        setError('No se pudieron cargar las marcas');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    
    fetchDatos();
  }, [router]);

  const handleEliminar = async (id: number, nombreMarca: string) => {
    const confirmacion = window.confirm(`¿Estás seguro que deseas eliminar la marca "${nombreMarca}"?`);
    
    if (confirmacion) {
      try {
        await deleteMarca(id);
        setMarcas(marcas.filter((marca) => marca.id !== id));
      } catch (err) {
        alert('Hubo un error al intentar eliminar la marca. Verifica que no tenga vehículos asociados.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} /> 
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8">

        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
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
              Gestión de Marcas
            </h1>
          </div>
          
          <Link href="/usuario/dashboard/marcas/nuevaMarca" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-900/20">
            Nueva Marca
          </Link>
        </header>

        <div className="w-full max-w-5xl mx-auto text-gray-600 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {cargando ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-6 text-center font-medium">
              {error}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-500 text-white border-b border-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {marcas.length > 0 ? (
                  marcas.map((marca) => (
                    <tr key={marca.id} className="border-b text-gray-800 border-gray-600 hover:bg-gray-300 transition-colors">
                      <td className="p-4 font-medium">{marca.nombre}</td>
                      <td className="p-4 text-center space-x-2">
                      <Link href={`/usuario/dashboard/marcas/${marca.id}`} className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                        Editar
                      </Link>
                      <button onClick={() => handleEliminar(marca.id, marca.nombre)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors font-medium" >
                        Eliminar
                      </button>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500">
                      No hay marcas registradas todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
      </main>
    </div>
  );
}