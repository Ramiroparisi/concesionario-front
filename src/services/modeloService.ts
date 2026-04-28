import api from '@/lib/axios';

export const getModelos = async () => {
  const response = await api.get('/modelos');
  return response.data.data;
}
export const createModelo = async (datosModelo: unknown) => {
  const response = await api.post('/modelos', datosModelo);
  return response.data.data;
}

export const getModeloById = async (id: number) => {
  const response = await api.get(`/modelos/${id}`);
  return response.data.data;
};

export const updateModelo = async (id: number, datosModelo: unknown) => {
  const response = await api.put(`/modelos/${id}`, datosModelo);
  return response.data.data;
};

export const deleteModelo = async (id: number) => {
  const response = await api.delete(`/modelos/${id}`);
  return response.data.data;
};