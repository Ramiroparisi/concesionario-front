'use client'
import "tailwindcss";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import HomeButton from '@/components/HomeButton';
import { fondo_login } from "@/assets/images";

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(mail, contrasena);
      console.log('Login exitoso:', data);
      router.push('/usuario/dashboard'); 
    } catch (err: unknown) {
      setError((err as { message?: string }).message || 'Error al iniciar sesión');
    }
  };

  return (
   <div className=" min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${fondo_login.src})` }} >
   <HomeButton />

   <div className="absolute inset-0 bg-gray-900 opacity-50 z-0"></div>
   
   <div className="relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg px-4">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
         <div className="relative border-b-2 focus-within:border-blue-600 transition-all">
           <input
             type="email"
             value={mail}
             onChange={(e) => setMail(e.target.value)}
             placeholder=" "
             required
             className="peer h-10 w-full bg-transparent placeholder-transparent focus:outline-none"
            />
           <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
             peer-placeholder-shown:text-base 
             peer-placeholder-shown:text-gray-400 
             peer-placeholder-shown:top-2 
             peer-focus:-top-3.5 
             peer-focus:text-blue-600 
             peer-focus:text-sm">
             Email
           </label>
          </div>
          
          <div className="relative border-b-2 focus-within:border-blue-600 transition-all">
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder=" "
              required
              className="peer h-10 w-full bg-transparent placeholder-transparent focus:outline-none"
            />
           <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
             peer-placeholder-shown:text-base 
             peer-placeholder-shown:text-gray-400 
             peer-placeholder-shown:top-2 
             peer-focus:-top-3.5 
             peer-focus:text-blue-600 
             peer-focus:text-sm">
             Contraseña
           </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}