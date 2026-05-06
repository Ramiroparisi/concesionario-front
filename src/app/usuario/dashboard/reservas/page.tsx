'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import { FaCalendarAlt, FaCar, FaUser, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

interface Marca {
  nombre: string;
}
interface Modelo {
  nombre: string;
  marca: Marca;
}
interface Vehiculo {
  id: number;
  patente: string;
  modelo: Modelo;
  estado: string;
}
interface Reserva {
  id: number;
  nombreCli: string;
  apellidoCli: string;
  mail: string;
  telefono: string;
  dni: string;
  importe: number;
  fechaVenc: string;
  estadoReserva: string;
  formaPago: string;
  vehiculo: Vehiculo;
}

export default function ReservasPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const authRes = await api.get('/auth/verify-token');
        const rol = authRes.data.user?.rol;

        if (rol !== 'Admin' && rol !== 'Empleado') {
          router.push('/usuario/login');
          return;
        }

        const res = await api.get('/reservas');
        const reservasActivas = res.data.data.filter((r: Reserva) => 
          r.estadoReserva === 'Activa'
        );
        setReservas(reservasActivas);

      } catch (err) {
        setError('No se pudieron cargar las reservas.');
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, [router]);

  const manejarEstadoReserva = async (idReserva: number, nuevoEstado: string, accion: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas marcar esta reserva como ${accion}?`);
    
    if (!confirmacion) return;

    try {
      await api.patch(`/reservas/${idReserva}`, {
        estadoReserva: nuevoEstado,
        estado : nuevoEstado
      });

      alert(`Reserva ${accion.toLowerCase()} con éxito.`);
      setReservas(reservas.filter(r => r.id !== idReserva));
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar la reserva.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8 w-full">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="relative z-[60] md:z-auto">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-colors border border-gray-700 shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">
              Gestión de Reservas
            </h1>
          </div>
        </header>

        {cargando ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 text-center font-medium rounded-xl">
            {error}
          </div>
        ) : reservas.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm max-w-2xl mx-auto w-full mt-10">
            <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No hay reservas activas</h3>
            <p className="text-gray-500">Todas las reservas han sido gestionadas o no hay ingresos recientes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    reserva.estadoReserva === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reserva.estadoReserva}
                  </span>
                  <span className="text-xl font-semibold text-gray-500">
                    Seña: ARS$ {reserva.importe}
                  </span>
                </div>

                <div className="p-6 flex-1 space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                      <FaCar /> Vehículo
                    </h3>
                    <p className="font-bold text-gray-900 text-lg leading-tight">
                     {reserva.vehiculo?.modelo?.marca?.nombre || 'Marca desconocida'} {reserva.vehiculo?.modelo?.nombre || ''}
                    </p>
                    <p className="text-sm text-gray-500">Patente: <span className="font-medium text-gray-800">{reserva.vehiculo.patente || '0KM'}</span></p>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                      <FaUser /> Cliente
                    </h3>
                    <p className="font-medium text-gray-900">{reserva.nombreCli} {reserva.apellidoCli}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <FaPhoneAlt className="text-gray-400" /> {reserva.telefono}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-gray-400" /> {reserva.mail}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">DNI: {reserva.dni}</p>
                  </div>

                  <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-sm flex items-center gap-2">
                    <FaCalendarAlt /> 
                    Vence: {new Date(reserva.fechaVenc).toLocaleDateString('es-AR')}
                  </div>
                </div>

                <div className="flex border-t border-gray-200">
                  <button 
                    onClick={() => manejarEstadoReserva(reserva.id, 'Cancelada', 'Cancelada')}
                    className="flex-1 py-4 text-red-600 font-semibold hover:bg-red-50 transition-colors border-r border-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => manejarEstadoReserva(reserva.id, 'Finalizada', 'Vendida')}
                    className="flex-1 py-4 text-green-600 font-bold hover:bg-green-50 transition-colors"
                  >
                    Concretar Venta
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}