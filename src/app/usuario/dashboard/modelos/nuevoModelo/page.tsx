'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';
import { createModelo } from '@/services/modeloService';
import { getMarcas } from '@/services/marcaService';
import Sidebar from '@/components/Sidebar';

interface Marca {
  id: number;
  nombre: string;
}

export default function NuevaModeloPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaId, setMarcaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [cantidadPuertas, setCantidadPuertas] = useState('');
  const [combustible, setCombustible] = useState('');
  const [motor, setMotor] = useState('');
  const [potenciaCv, setPotenciaCv] = useState('');
  const [transmision, setTransmision] = useState('');

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const authRes = await api.get('/auth/verify-token');
        const rol = authRes.data.user?.rol;
        
        if (rol !== 'Admin' && rol !== 'Empleado') {
          router.push('/usuario/login');
          return;
        }
        
        const marcasObtenidas = await getMarcas();
        setMarcas(marcasObtenidas);

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

    const datosNuevoModelo = {
      nombre,
      marca: Number(marcaId),
      cantPuertas: Number(cantidadPuertas),
      combustible,
      motor,
      potencia: Number(potenciaCv),
      transmision
    };

    try {
      await createModelo(datosNuevoModelo);
      router.push('/usuario/dashboard/modelos');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al guardar el modelo');
      } else {
        setError('Error al guardar el modelo');
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">Nuevo Modelo</h1>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                <select
                  value={marcaId}
                  onChange={(e) => setMarcaId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="" disabled>Seleccione una marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Modelo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cantidad de Puertas</label>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={cantidadPuertas}
                  onChange={(e) => setCantidadPuertas(e.target.value)}
                  placeholder="Ej: 3, 4, 5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Combustible</label>
                <select
                  value={combustible}
                  onChange={(e) => setCombustible(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="" disabled>Seleccione</option>
                  <option value="Nafta">Nafta</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="GNC">GNC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Motor</label>
                <input
                  type="text"
                  value={motor}
                  onChange={(e) => setMotor(e.target.value)}
                  placeholder="Ej: 2.0 TSI"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Potencia (CV)</label>
                <input
                  type="number"
                  min="1"
                  value={potenciaCv}
                  onChange={(e) => setPotenciaCv(e.target.value)}
                  placeholder="Ej: 150"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transmisión</label>
                <select
                  value={transmision}
                  onChange={(e) => setTransmision(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all ${
                  enviando ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {enviando ? 'Guardando...' : 'Guardar Modelo'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}