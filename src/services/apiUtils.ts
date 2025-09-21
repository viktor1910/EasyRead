// API utility functions for making HTTP requests
import AxiosConfig from '../AxiosConfig';

/**
 * Generic API request function using AxiosConfig
 * Deprecated: Use specific service functions instead
 */
export const apiRequest = async (endpoint: string, options: any = {}) => {
  const { method = 'GET', body, ...config } = options;
  
  const axiosConfig = {
    method: method.toLowerCase(),
    url: endpoint,
    ...config,
  };

  if (body) {
    if (body instanceof FormData) {
      axiosConfig.data = body;
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    } else {
      axiosConfig.data = body;
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Content-Type': 'application/json',
      };
    }
  }

  try {
    const response = await AxiosConfig(axiosConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};