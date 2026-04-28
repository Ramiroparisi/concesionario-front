'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getMarcaById, updateMarca } from '@/services/marcaService';

export default function EditarMarcaPage() {
  const router = useRouter();
  const params = useParams();
  const marcaId = Number(params.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [nombre, setNombre] = useState('');
  const [nombreOriginal, setNombreOriginal] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchMarca = async () => {
      try {
        const marca = await getMarcaById(marcaId);
        setNombre(marca.nombre);
        setNombreOriginal(marca.nombre);
      } catch (err) {
        setError('No se pudo cargar la información de la marca.');
        console.error("Motivo del error:", err);
      } finally {
        setCargando(false);
      }
    };
    fetchMarca();
  }, [marcaId]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setGuardando(true);
    try {
      await updateMarca(marcaId, nombre);
      setNombreOriginal(nombre); 
      setIsEditing(false); 
    } catch (err) {
      alert('Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };


  const handleCancelar = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setNombre(nombreOriginal);
    setIsEditing(false);
  };

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">
            Editar Marca
          </h1>
        </header>

        <div className="max-w-xl mx-auto w-full">
          {cargando ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 p-6 text-center font-medium rounded-xl">
              {error}
            </div>
          ) : (
            <form onSubmit={handleGuardar} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Marca
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    !isEditing 
                      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                  }`}
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/usuario/dashboard/marcas');
                      }}
                      className="flex-1 px-4 py-3 border border-gray-700 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-400 transition-colors font-medium shadow-md"
                    >
                      Editar Marca
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelar}
                      className="flex-1 px-4 py-3 bg-red-500 border border-gray-700 text-white rounded-xl hover:bg-red-400 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={guardando}
                      className="flex-1 px-4 py-3 border border-gray-700 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
                    >
                      {guardando ? 'Guardando...' : 'Aceptar Cambios'}
                    </button>
                  </>
                )}
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}