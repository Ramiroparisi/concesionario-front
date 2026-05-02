'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import { getMarcas } from '@/services/marcaService';
import { getModelos } from '@/services/modeloService';
import { createVehiculo } from '@/services/vehiculoService';

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
  marca: Marca;
}

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelosTotales, setModelosTotales] = useState<Modelo[]>([]);

  const [marcaId, setMarcaId] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [patente, setPatente] = useState('');
  const [anio, setAnio] = useState('');
  const [color, setColor] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [kilometraje, setKilometraje] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [fotos, setFotos] = useState<FileList | null>(null);

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const authRes = await api.get('/auth/verify-token');
        const rol = authRes.data.user?.rol;
        
        if (rol !== 'Admin' && rol !== 'Empleado') {
          router.push('/usuario/login');
          return;
        }

        const [marcasData, modelosData] = await Promise.all([
          getMarcas(),
          getModelos()
        ]);

        setMarcas(marcasData);
        setModelosTotales(modelosData);

      } catch (err) {
        router.push('/usuario/login');
      } finally {
        setCargando(false);
      }
    };
    inicializarDatos();
  }, [router]);

  const modelosFiltrados = marcaId 
    ? modelosTotales.filter((m) => {
        const idMarcaModelo = typeof m.marca === 'object' ? m.marca.id : m.marca;
        return idMarcaModelo.toString() === marcaId;
      })
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('marca', marcaId);
      formData.append('modelo', modeloId);
      formData.append('patente', patente.trim().toUpperCase());
      formData.append('anio', anio);
      formData.append('precio', precio);
      formData.append('kilometraje', kilometraje);
      formData.append('estado', estado);
      formData.append('color', color);
      formData.append('descripcion', descripcion);
      formData.append('moneda', moneda);

      if (fotos) {
        for (let i = 0; i < fotos.length; i++) {
          formData.append('fotos', fotos[i]);
        }
      }

      await createVehiculo(formData);
      router.push('/usuario/dashboard/vehiculos');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al guardar el vehículo');
      } else {
        setError('Error al guardar el vehículo');
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
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white border border-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">Nuevo Vehículo</h1>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-10">
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
                  onChange={(e) => { setMarcaId(e.target.value);setModeloId('');}}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="" disabled>Seleccione una marca...</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
                <select
                  value={modeloId}
                  onChange={(e) => setModeloId(e.target.value)}
                  required
                  disabled={!marcaId || modelosFiltrados.length === 0}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                    !marcaId 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                >
                  <option value="" disabled>
                    {!marcaId ? 'Primero seleccione una marca' : 'Seleccione un modelo...'}
                  </option>
                  {modelosFiltrados.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Vehículo de uso diario"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patente <span className="text-gray-400 font-normal text-xs">(Dejar vacío si es 0km)</span>
                </label> 
                <input
                  type="text"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  placeholder="Ej: AB123CD o AA111AA"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Año</label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kilometraje</label>
                <input
                  type="number"
                  min="0"
                  value={kilometraje}
                  onChange={(e) => setKilometraje(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 15000000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>

              <div className="sm:col-span-2 mt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fotos del Vehículo (Opcional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFotos(e.target.files)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">Puedes seleccionar varias imágenes a la vez manteniendo presionada la tecla Ctrl</p>
              </div>

            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 bg-red-600 border border-gray-700 text-white rounded-xl hover:bg-red-400 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className={`flex-1 px-4 py-3 bg-green-600 border border-gray-700 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all ${
                  enviando ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {enviando ? 'Guardando...' : 'Guardar Vehículo'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}