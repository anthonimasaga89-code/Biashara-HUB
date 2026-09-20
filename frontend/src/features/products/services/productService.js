import api from '../../../api/axiosClient'; // Hakikisha una Axios instance yako

export const productService = {
  // 1. Kupata orodha ya bidhaa zote pamoja na vichujio (Search & Filters)
  getProducts: async (params) => {
    const response = await api.get('/api/v1/products', { params });
    return response.data;
  },

  // 2. Kupata maelezo ya bidhaa moja kulingana na ID
  getProductById: async (productId) => {
    const response = await api.get(`/api/v1/products/${productId}`);
    return response.data;
  },

  // 3. Kutengeneza bidhaa mpya
  createProduct: async (productData) => {
    const response = await api.post('/api/v1/products', productData);
    return response.data;
  },

  // 4. Kurekebisha bidhaa iliyopo
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/api/v1/products/${productId}`, productData);
    return response.data;
  },

  // 5. Kuondoa/Kudeactivate bidhaa
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/v1/products/${productId}`);
    return response.data;
  },

  // 6. Kupakia Picha au Video za bidhaa
  uploadMedia: async (productId, formData, onProgress) => {
    const response = await api.post(`/api/v1/products/${productId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
      },
    });
    return response.data;
  },

  // 7. Kufuta media (Picha/Video)
  deleteMedia: async (productId, mediaId) => {
    const response = await api.delete(`/api/v1/products/${productId}/media/${mediaId}`);
    return response.data;
  },
};