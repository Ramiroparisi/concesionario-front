import api from '../src/lib/axios';
import { getVehiculos } from '@/services/vehiculoService'; 
import { expect, jest, test } from '@jest/globals';

jest.mock('@/lib/axios');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Unitario: Vehiculo Service', () => {
  it('debería procesar correctamente los vehículos devueltos por la API (Mock)', async () => {
    const datosFalsos = {
      data: {
        data: [{ id: 1, modelo: { nombre: 'X6', marca: { nombre: 'BMW' } }, precio: 50000 }]
      }
    };

    mockedApi.get.mockResolvedValue(datosFalsos);

    const vehiculos = await getVehiculos();

    expect(mockedApi.get).toHaveBeenCalledWith('/vehiculos');
    expect(vehiculos[0].modelo.nombre).toBe('X6');
    expect(vehiculos[0].precio).toBe(50000);
  });
});