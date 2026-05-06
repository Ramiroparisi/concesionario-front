'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ReservaPresencialPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://concesionario-back-production.up.railway.app/api';
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombreCli: '',
    apellidoCli: '',
    dni: '',
    mail: '',
    telefono: '',
    importe: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const datosParaEnviar = {
      ...formData,
      importe: Number(formData.importe),
      vehiculo: Number(id),
    };

    try {
      const response = await fetch(`${apiUrl}/reservas/presencial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });

      if (response.ok) {
        alert("Reserva registrada con éxito.");
        router.push('/usuario/dashboard/vehiculos');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={false} />
      <div className="flex-1 flex flex-col">
        <main className="p-8">          
          <button 
            onClick={() => router.back()}
            className="flex-1 px-12 py-3 bg-red-400 text-white text-xl rounded-xl hover:bg-red-600 transition-colors font-medium">
            Volver
          </button>          
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-200">
            <h1 className="text-3xl font-light mb-8 text-gray-900 uppercase text-center">
              Nueva Reserva Presencial
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-m uppercase text-gray-500 mb-2">Nombre del Cliente</label>
                  <input type="text" name="nombreCli" required onChange={handleChange} className="w-full text-m border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-m uppercase  text-gray-500 mb-2">Apellido del Cliente</label>
                  <input type="text" name="apellidoCli" required onChange={handleChange} className="w-full text-m border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-m uppercase text-gray-500 mb-2">DNI</label>
                  <input type="text" name="dni" required onChange={handleChange} className="w-full text-m border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-m uppercase text-gray-500 mb-2">Teléfono</label>
                  <input type="text" name="telefono" required onChange={handleChange} className="w-full text-m border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-m uppercase text-gray-500 mb-2">Correo Electrónico</label>
                <input type="email" name="mail" required onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-m uppercase text-gray-500 mb-2">Monto de la Seña ($)</label>
                <input type="number" name="importe" required onChange={handleChange} className="w-full text-m border-b border-gray-300 py-2 focus:border-black outline-none transition-colors font-semibold text-xl" />
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all disabled:bg-gray-400"
                >
                  {loading ? 'Registrando...' : 'Confirmar Reserva en Efectivo'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}