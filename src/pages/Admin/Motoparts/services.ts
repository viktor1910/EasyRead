import { apiRequest } from '../../../services/apiUtils';

export const motopartsService = {
  // Get all motoparts with pagination and filters
  getMotoparts: async (params: Record<string, any> = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc: Record<string, string>, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {})
    ).toString();
    
    return apiRequest(`/motoparts${queryString ? `?${queryString}` : ''}`);
  },

  // Get single motopart by ID
  getMotopartById: (id: number) => {
    return apiRequest(`/motoparts/${id}`);
  },

  // Get single motopart by slug
  getMotopartBySlug: (slug: string) => {
    return apiRequest(`/motoparts/slug/${slug}`);
  },

  // Create new motopart
  createMotopart: (data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest('/motoparts', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Update motopart
  updateMotopart: (id: number, data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest(`/motoparts/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Delete motopart
  deleteMotopart: (id: number) => {
    return apiRequest(`/motoparts/${id}`, {
      method: 'DELETE',
    });
  },

  // Get most ordered motoparts
  getMostOrderedMotoparts: () => {
    return apiRequest('/motoparts/most-ordered');
  },
};

export default motopartsService;