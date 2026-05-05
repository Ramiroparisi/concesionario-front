'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';

import { getMarcas } from '@/services/marcaService';
import { getModelos } from '@/services/modeloService';
// Importamos deleteVehiculo
import { getVehiculoById, updateVehiculo, deleteVehiculo } from '@/services/vehiculoService';

interface Multimedia {
  id: number;
  archivo: string;
}

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
  marca: Marca;
}

export default function EditarVehiculoPage() {
  const router = useRouter();
  const params = useParams();
  const vehiculoId = Number(params.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelosTotales, setModelosTotales] = useState<Modelo[]>([]);

  const [marcaId, setMarcaId] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [patente, setPatente] = useState('');
  const [anio, setAnio] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [fotosNuevas, setFotosNuevas] = useState<FileList | null>(null);
  
  const [fotosActuales, setFotosActuales] = useState<Multimedia[]>([]);

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const authRes = await api.get('/auth/verify-token');
        const rol = authRes.data.user?.rol;
        
        if (rol !== 'Admin' && rol !== 'Empleado') {
          router.push('/usuario/login');
          return;
        }

        const [marcasData, modelosData, vehiculoObtenido] = await Promise.all([
          getMarcas(),
          getModelos(),
          getVehiculoById(vehiculoId)
        ]);

        setMarcas(marcasData);
        setModelosTotales(modelosData);

        setPatente(vehiculoObtenido.patente || '');
        setAnio(vehiculoObtenido.anio?.toString() || '');
        setPrecio(vehiculoObtenido.precio?.toString() || '');
        setEstado(vehiculoObtenido.estado || 'Disponible');
        setMoneda(vehiculoObtenido.moneda || 'USD');
        if (vehiculoObtenido.modelo) {
          setModeloId(vehiculoObtenido.modelo.id?.toString() || '');
          if (vehiculoObtenido.modelo.marca) {
            setMarcaId(vehiculoObtenido.modelo.marca.id?.toString() || '');
          }
        }

        if (vehiculoObtenido.multimedia) {
          setFotosActuales(vehiculoObtenido.multimedia);
        }

      } catch (err) {
        setError('No se pudo cargar la información del vehículo.');
      } finally {
        setCargando(false);
      }
    };
    inicializarDatos();
  }, [vehiculoId, router]);

  const modelosFiltrados = marcaId 
    ? modelosTotales.filter((m) => m.marca?.id.toString() === marcaId)
    : [];

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('marca', marcaId);
      formData.append('modelo', modeloId);
      formData.append('patente', patente.trim()); 
      formData.append('anio', anio);
      formData.append('precio', precio);
      formData.append('estado', estado);
      formData.append('moneda', moneda);

      if (fotosNuevas) {
        for (let i = 0; i < fotosNuevas.length; i++) {
          formData.append('fotos', fotosNuevas[i]);
        }
      }

      await updateVehiculo(vehiculoId, formData);
      setIsEditing(false);
      alert('Vehículo actualizado correctamente.');
      window.location.reload();
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al guardar los cambios');
      } else {
        setError('Error al guardar los cambios');
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setFotosNuevas(null);
    window.location.reload(); 
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer y borrará sus fotos.');
    if (confirmar) {
      try {
        setCargando(true);
        await deleteVehiculo(vehiculoId);
        alert('Vehículo eliminado con éxito.');
        router.push('/usuario/dashboard/vehiculos');
      } catch (err) {
        alert('Ocurrió un error al intentar eliminar el vehículo.');
        setCargando(false);
      }
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
            Editar Vehículo
          </h1>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-10">
          <form onSubmit={handleGuardar} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {fotosActuales.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Fotos Actuales</label>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {fotosActuales.map((foto) => (
                    <img 
                      key={foto.id} 
                      src={`http://localhost:3000/uploads/${foto.archivo}`} 
                      alt="Foto vehículo" 
                      className={`w-32 h-24 object-cover rounded-xl border border-gray-200 shadow-sm flex-shrink-0 transition-opacity ${fotosNuevas ? 'opacity-30' : 'opacity-100'}`}
                    />
                  ))}
                </div>
                {fotosNuevas && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">Estas fotos serán eliminadas y reemplazadas por las nuevas.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                <select
                  value={marcaId}
                  onChange={(e) => {
                    setMarcaId(e.target.value);
                    setModeloId(''); 
                  }}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none transition-all ${
                    !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500 appearance-none' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                >
                  <option value="" disabled>Seleccione</option>
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
                  disabled={!isEditing || !marcaId || modelosFiltrados.length === 0}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none transition-colors ${
                    !isEditing || !marcaId 
                      ? 'bg-gray-100 border-gray-200 text-gray-500 appearance-none cursor-not-allowed'
                      : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                >
                  <option value="" disabled>Seleccione</option>
                  {modelosFiltrados.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patente <span className="text-gray-400 font-normal text-xs">(Dejar vacío si es 0km)</span>
                </label>
                <input
                  type="text"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none text-gray-800 uppercase ${
                  !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Año</label>
                <input
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none text-gray-800 ${
                    !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none transition-all ${
                    !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500 appearance-none' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none text-gray-800 ${
                    !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-400 outline-none transition-all ${
                    !isEditing ? 'bg-gray-100 border-gray-200 text-gray-500 appearance-none' : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>

              {isEditing && (
                <div className="sm:col-span-2 mt-2 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reemplazar todas las fotos <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFotosNuevas(e.target.files)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-gray-100 mt-6">
              {!isEditing ? (
              <>

              <div className="flex flex-wrap gap-3 w-full">
                <button
                  type="button"
                  onClick={() => router.push('/usuario/dashboard/vehiculos')}
                  className="flex-1 min-w-[120px] px-4 py-3 border border-gray-500 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors font-medium">
                   Volver
                </button>
                
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                  className="flex-1 min-w-[120px] px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium shadow-md">
                   Editar
                </button>
              </div>

            <div className="flex flex-wrap py-4 gap-3 w-full">
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={estado === 'Reservado'}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-colors ${
                  estado === 'Reservado'
                  ? 'bg-gray-400 opacity-60 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-400'
                  }`}>
                  {estado === 'Reservado' ? 'Auto Reservado (No se puede eliminar)' : 'Eliminar Vehículo'}
                </button>

               <button
                type="button"
                onClick={() => router.push(`/usuario/dashboard/vehiculos/${vehiculoId}/reservaPresencial`)}
                disabled={estado !== 'Disponible'} 
                className={`flex-1 px-4 py-3 text-white rounded-xl font-bold transition-all shadow-md
                ${estado === 'Disponible' 
                  ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                  : 'bg-gray-400 opacity-60 cursor-not-allowed'
                }`}>
                {estado === 'Disponible' ? 'Reservar' : `Vehículo ${estado}`}
               </button>
             </div>             
              </>
            ) : (
          <div className="flex flex-wrap gap-3 w-full">
            <button
              type="button"
              onClick={handleCancelar}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-400 transition-colors font-medium">
                Cancelar
            </button>
      
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md disabled:opacity-50">
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
          )}
          </div>
          </form>
        </div>
      </main>
    </div>
  );
}