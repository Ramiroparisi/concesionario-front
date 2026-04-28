'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';
import { createEmpleado } from '@/services/empleadoService';
import Sidebar from '@/components/Sidebar';


export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const [dni, setDni] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [cuil, setCuil] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const authRes = await api.get('/auth/verify-token');
        const rol = authRes.data.user?.rol;
        
        if (rol !== 'Admin') {
          router.push('/usuario/dashboard');
          return;
        }
        
      } catch (err) {
        router.push('/usuario/login');
      } finally {
        setCargando(false);
      }
    };
    inicializarDatos();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    const datosNuevoEmpleado = {
      nombre,
      apellido,
      mail,
      contrasena,
      telefono,
      rol,
      dni,
      domicilio,
      cuil,
      fechaNac
    };

    try {
      await createEmpleado(datosNuevoEmpleado);
      router.push('/usuario/dashboard/empleados');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al guardar el empleado');
      } else {
        setError('Error al guardar el empleado');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8">
        <header className="flex items-center mb-8 pb-4 border-b border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white border border-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">Nuevo Empleado</h1>
        </header>

        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">DNI</label>
                <input
                  type="number"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mail</label>
                <input
                  type="text"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <input
                  type="text"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                <input
                  type="number"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Domicilio</label>
                <input
                  type="text"
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CUIL</label>
                <input
                  type="number"
                  value={cuil}
                  onChange={(e) => setCuil(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaNac}
                  onChange={(e) => setFechaNac(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
                <input
                  type="text"
                  min="1"
                  value={rol}
                  onChange={(e) => setRol("empleado")}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 bg-red-500 border border-gray-300 text-white rounded-xl hover:bg-red-400 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className={`flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all ${
                  enviando ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {enviando ? 'Guardando...' : 'Guardar empleado'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}