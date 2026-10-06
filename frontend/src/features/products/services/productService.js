import api from '../../../api/axiosClient';

export const productService = {
  getProducts: async () => {
    const response = await api.get('/api/businesses/my');
    return response.data;
  },

  getProductById: async (businessId) => {
    const response = await api.get(`/api/businesses/${businessId}`);
    return response.data;
  },

  createProduct: async (businessData) => {
    const response = await api.post('/api/businesses/', businessData);
    return response.data;
  },

  updateProduct: async (businessId, businessData) => {
    const response = await api.put(`/api/businesses/${businessId}`, businessData);
    return response.data;
  },

  deleteProduct: async (businessId) => {
    const response = await api.delete(`/api/businesses/${businessId}`);
    return response.data;
  },

  getMyBusinesses: async () => {
    const response = await api.get('/api/businesses/my');
    return response.data;
  },

  createBusiness: async (businessData) => {
    const response = await api.post('/api/businesses/', businessData);
    return response.data;
  },

  updateBusiness: async (businessId, businessData) => {
    const response = await api.put(`/api/businesses/${businessId}`, businessData);
    return response.data;
  },

  deleteBusiness: async (businessId) => {
    const response = await api.delete(`/api/businesses/${businessId}`);
    return response.data;
  },

  uploadMedia: async () => {
    throw new Error('Media upload is not supported by the current backend API.');
  },

  deleteMedia: async () => {
    throw new Error('Media delete is not supported by the current backend API.');
  },
};