import AxiosConfig from '../../../AxiosConfig';
import { 
  MotopartsQueryParams, 
  CreateMotopartRequest, 
  UpdateMotopartRequest,
  MotopartPaginationResponse, 
  Motopart 
} from '../../../types/api';

export const motopartsService = {
  // Get all motoparts with pagination and filters - matches Django backend
  getMotoparts: async (params: MotopartsQueryParams = {}): Promise<MotopartPaginationResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc: Record<string, string>, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {})
    ).toString();
    
    const response = await AxiosConfig.get(`/motoparts/${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get single motopart by ID - Now implemented with DetailView
  getMotopartById: async (id: number): Promise<Motopart> => {
    const response = await AxiosConfig.get(`/motoparts/${id}/`);
    return response.data;
  },

  // Create new motopart - matches Django ListCreateAPIView
  createMotopart: async (data: CreateMotopartRequest): Promise<Motopart> => {
    const response = await AxiosConfig.post('/motoparts/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Update motopart - Now implemented with DetailView  
  updateMotopart: async (id: number, data: UpdateMotopartRequest): Promise<Motopart> => {
    const response = await AxiosConfig.put(`/motoparts/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Delete motopart - Now implemented with DetailView
  deleteMotopart: async (id: number): Promise<void> => {
    await AxiosConfig.delete(`/motoparts/${id}/`);
  },
};

export default motopartsService;