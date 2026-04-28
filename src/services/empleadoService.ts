import { api } from '@/lib/axios';

interface UsuarioBackend {
  rol: string;
  [key: string]: unknown;
}

interface DatosEmpleado {
  nombre?: string;
  apellido?: string;
  email?: string;
  contrasena?: string;
  telefono?: string;
  [key: string]: unknown; 
}

export const getEmpleados = async () => {
  const response = await api.get('/usuarios');
  const usuarios = response.data.data || response.data;
  const empleados = usuarios.filter((user: UsuarioBackend) => user.rol === 'Empleado');
  
  return empleados;
};

export const createEmpleado = async (datos: DatosEmpleado) => {
  const datosConRol = { ...datos, rol: 'Empleado' };
  const response = await api.post('/usuarios', datosConRol);
  return response.data.data;
};

export const getEmpleadoById = async (id: number) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data.data;
};

export const updateEmpleado = async (id: number, datos: DatosEmpleado) => {
  const response = await api.put(`/usuario/${id}`, datos);
  return response.data.data;
};

export const deleteEmpleado = async (id: number) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data.data;
};