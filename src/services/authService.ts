import api from '@/lib/axios';

export const login = async (mail: string, contrasena: string) => {
  try {
    const response = await api.post('/auth/login', { mail, contrasena });
    return response.data; 
  } catch (error: unknown) {
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al iniciar sesión');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout'); 
  } catch (error) {
    console.error("Error al avisar al back", error);
  } finally {
    localStorage.removeItem('user');
    window.location.href = '/usuario/login';
  }
};