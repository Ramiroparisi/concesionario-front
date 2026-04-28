'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getEmpleadoById, updateEmpleado } from '@/services/empleadoService';
import { api } from '@/lib/axios';


interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  telefono: string;
  dni: string;
  domicilio: string;
  cuil: string;
  fechaNac: Date;
}

export default function EditarEmpleadoPage() {
  const router = useRouter();
  const params = useParams();
  const empleadoId = Number(params.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [guardando, setGuardando] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [nombreOriginal, setNombreOriginal] = useState('');
  
  const [apellido, setApellido] = useState('');
  const [apellidoOriginal, setApellidoOriginal] = useState('');
  
  const [mail, setMail] = useState('');
  const [mailOriginal, setMailOriginal] = useState('');
  
  const [telefono, setTelefono] = useState('');
  const [telefonoOriginal, setTelefonoOriginal] = useState('');

  const [dni, setDni] = useState('');
  const [dniOriginal, setDniOriginal] = useState('');

  const [domicilio, setDomicilio] = useState('');
  const [domicilioOriginal, setDomicilioOriginal] = useState('');

  const [cuil, setCuil] = useState('');
  const [cuilOriginal, setCuilOriginal] = useState('');

  const [fechaNac, setFechaNac] = useState('');
  const [fechaNacOriginal, setFechaNacOriginal] = useState('');
  
  const [contrasena, setContrasena] = useState('');
  const [contrasenaOriginal, setContrasenaOriginal] = useState('');
  

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        try {
          const authRes = await api.get('/auth/verify-token');
          const rol = authRes.data.user?.rol;
          if (rol !== 'Admin') {
            router.push('/usuario/dashboard');
            return;
          }
        } catch {
          router.push('/usuario/login');
          return;
        }


        const empleadoObtenido = await getEmpleadoById(empleadoId);

      if (empleadoObtenido.fechaNac) {
        const fechaLimpia = empleadoObtenido.fechaNac.split('T')[0];
        setFechaNac(fechaLimpia);
        setFechaNacOriginal(fechaLimpia);
      }

      setNombre(empleadoObtenido.nombre || '');
      setApellido(empleadoObtenido.apellido || '');
      setDni(empleadoObtenido.dni || '');
      setCuil(empleadoObtenido.cuil || '');
      setDomicilio(empleadoObtenido.domicilio || '');
      setMail(empleadoObtenido.mail || '');
      setTelefono(empleadoObtenido.telefono || '');

    } catch (err) {
      setError('No se pudo cargar la información.');
    } finally {
      setCargando(false);
    }
  };
  
  inicializarDatos();
}, [empleadoId, router]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setGuardando(true);

    const datosActualizados = {
      nombre,
      apellido: apellido,
      mail: mail,
      telefono: telefono,
      contrasena: contrasena,
      dni: dni,
      domicilio: domicilio,
      cuil: cuil,
      fechaNac: fechaNac,
    };

    try {
      await updateEmpleado(empleadoId, datosActualizados);
      
      setNombreOriginal(nombre); 
      setApellidoOriginal(apellido);
      setMailOriginal(mail);
      setTelefonoOriginal(telefono);
      setContrasenaOriginal(contrasena);
      setDniOriginal(dni);
      setDomicilioOriginal(domicilio);
      setCuilOriginal(cuil);
      setFechaNacOriginal(fechaNac);

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
    setApellido(apellidoOriginal);
    setMail(mailOriginal);
    setTelefono(telefonoOriginal);
    setContrasena(contrasenaOriginal);
    setDni(dniOriginal);
    setDomicilio(domicilioOriginal);
    setCuil(cuilOriginal);
    setFechaNac(fechaNacOriginal);
    
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
            Editar empleado
          </h1>
        </header>

        <div className="max-w-4xl mx-auto w-full">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">DNI</label>
                  <input
                    type="string"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                  <input
                    type="string"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                  <input
                    type="string"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="text"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2"> Contraseña </label>
                  <input
                    type="string"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2"> Teléfono </label>
                  <input
                    type="string"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Domicilio</label>
                  <input
                    type="string"
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CUIL</label>
                  <input
                    type="string"
                    value={cuil}
                    onChange={(e) => setCuil(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={fechaNac}
                    onChange={(e) => setFechaNac(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      !isEditing 
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 text-gray-800'
                    }`}
                  />
                </div>

              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-6">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/usuario/dashboard/empleados');
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
                      Editar Empleado
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