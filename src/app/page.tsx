'use client';

import { useEffect, useState } from 'react';
import { getVehiculos } from '@/services/vehiculoService';

interface Vehiculo {
  id: number;
  patente: string;
  modelo: { nombre: string };
  anio: number;
  precio: number;
  kilometraje: number;
  estado: string;
}

export default function CatalogoPublico() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCatalogo = async () => {
      const data = await getVehiculos();
      const autosDisponibles = data.filter((v: Vehiculo) => v.estado === 'Disponible');
      setVehiculos(autosDisponibles);
      setCargando(false);
    };

    cargarCatalogo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Concesionario Multimarcas</h1>
        <p className="mt-2 text-lg text-gray-600">Encontrá el auto de tus sueños</p>
      </header>

      {cargando ? (
        <p className="text-center text-gray-500">Cargando catálogo...</p>
      ) : vehiculos.length === 0 ? (
        <p className="text-center text-gray-500">No hay vehículos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {vehiculos.map((auto) => (
            <div key={auto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                [Imagen del Vehículo]
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {auto.modelo?.nombre || 'Modelo Desconocido'} - {auto.anio}
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">{auto.kilometraje} km</span>
                  <span className="text-2xl font-bold text-blue-600">${auto.precio}</span>
                </div>
                
                <button className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-800 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}