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

export const createVehiculo = async (datosVehiculo: unknown) => {
  const response = await api.post('/vehiculos', datosVehiculo);
  return response.data.data;
}

export const getVehiculoById = async (id: number) => {
  const response = await api.get(`/vehiculos/${id}`);
  return response.data.data;
};

export const updateVehiculo = async (id: number, datosVehiculo: unknown) => {
  const response = await api.put(`/vehiculos/${id}`, datosVehiculo);
  return response.data.data;
};

export const deleteVehiculo = async (id: number) => {
  const response = await api.delete(`/vehiculos/${id}`);
  return response.data.data;
};