import api from '@/lib/axios';

export const getMarcas = async () => {
  const response = await api.get('/marcas');
  return response.data.data;
}
export const createMarca = async (nombre: string) => {
  const response = await api.post('/marcas', { nombre });
  return response.data.data;
}

export const getMarcaById = async (id: number) => {
  const response = await api.get(`/marcas/${id}`);
  return response.data.data;
};

export const updateMarca = async (id: number, nombre: string) => {
  const response = await api.put(`/marcas/${id}`, { nombre });
  return response.data.data;
};

export const deleteMarca = async (id: number) => {
  const response = await api.delete(`/marcas/${id}`);
  return response.data.data;
};