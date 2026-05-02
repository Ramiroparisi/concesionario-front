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

export const createVehiculo = async (formData: FormData) => {
  const response = await api.post('/vehiculos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const getVehiculoById = async (id: number) => {
  const response = await api.get(`/vehiculos/${id}`);
  return response.data.data;
};

export const updateVehiculo = async (id: number, formData: FormData) => {
  const response = await api.put(`/vehiculos/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteVehiculo = async (id: number) => {
  const response = await api.delete(`/vehiculos/${id}`);
  return response.data.data;
};