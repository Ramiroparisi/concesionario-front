import api from '@/lib/axios';

export const getVehiculos = async () => {
  try {
    const response = await api.get('/vehiculos');
    return response.data.data; 
  } catch (error) {
    console.error('Error al obtener los vehículos', error);
    return [];
  }
};