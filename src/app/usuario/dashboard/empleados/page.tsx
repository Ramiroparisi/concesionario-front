'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getEmpleados, deleteEmpleado } from '@/services/empleadoService';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  dni: string;
  domicilio: string;
  cuil: string;
  fechaNac: string;
}

export default function EmpleadosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        try {
          const authRes = await api.get('/auth/verify-token');
          const rol = authRes.data.user?.rol;

        if (rol !== 'Admin') {
            router.push('/usuario/dashboard');
            return;
          }  
        } catch (authError) {
          router.push('/usuario/login');
          return;
        }

        const data = await getEmpleados();
        setEmpleados(data); 

      } catch (err) {
        setError('No se pudieron cargar los empleados');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    
    fetchDatos();
  }, [router]);

  const handleEliminar = async (id: number, nombreEmpleado: string) => {
    const confirmacion = window.confirm(`¿Estás seguro que deseas eliminar el empleado "${nombreEmpleado}"?`);
    
    if (confirmacion) {
      try {
        await deleteEmpleado(id);
        setEmpleados(empleados.filter((empleado) => empleado.id !== id));
      } catch (err) {
        alert('Hubo un error al intentar eliminar el empleado.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} /> 
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8">

        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-colors border border-gray-700"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">
              Gestión de Empleados
            </h1>
          </div>
          
          <Link href="/usuario/dashboard/empleados/nuevoEmpleado" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-900/20">
            Nuevo Empleado
          </Link>
        </header>

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
            <table className="w-full text-left">
              <thead className="bg-gray-500 text-white text-center border-b border-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold">Apellido</th>
                  <th className="p-4 font-semibold">Email</th> 
                  <th className="p-4 font-semibold">Teléfono</th>
                  <th className="p-4 font-semibold">DNI</th>
                  <th className="p-4 font-semibold">Domicilio</th>
                  <th className="p-4 font-semibold">CUIL</th>
                  <th className="p-4 font-semibold">Fecha de Nacimiento</th>
                  <th className="p-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.length > 0 ? (
                  empleados.map((empleado) => (
                    <tr key={empleado.id} className="border-b text-gray-800 text-center border-gray-600 hover:bg-gray-300 transition-colors">
                      <td className="p-4 font-medium">{empleado.nombre}</td>
                      <td className="p-4 font-medium">{empleado.apellido}</td>
                      <td className="p-4 font-medium">{empleado.mail}</td>
                      <td className="p-4 font-medium">{empleado.telefono}</td>
                      <td className="p-4 font-medium">{empleado.dni}</td>
                      <td className="p-4 font-medium">{empleado.domicilio}</td>
                      <td className="p-4 font-medium">{empleado.cuil}</td>
                      <td className="p-4 font-medium">{empleado.fechaNac ? new Date(empleado.fechaNac).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'}</td>

                      <td className="p-4 text-center space-x-2">
                      <Link href={`/usuario/dashboard/empleados/${empleado.id}`} className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                        Editar
                      </Link>
                      <button onClick={() => handleEliminar(empleado.id, empleado.nombre)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors font-medium" >
                        Eliminar
                      </button>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      No hay empleados registrados todavía.
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