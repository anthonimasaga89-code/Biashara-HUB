import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

export default function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaFile, setMediaFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    location: '',
    contact: '',
    delivery_info: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Tengeneza bidhaa kwanza
      const newProduct = await productService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });

      // 2. Kupakia media kama ipo
      if (mediaFile && newProduct?.id) {
        const mediaData = new FormData();
        mediaData.append('file', mediaFile);
        await productService.uploadMedia(newProduct.id, mediaData, (progress) => {
          setUploadProgress(progress);
        });
      }

      navigate('/business/products'); // Rudi kwenye orodha
    } catch (err) {
      setError(err?.response?.data?.message || 'Kuna tatizo limetokea. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Ongeza Bidhaa Mpya</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Jina la Bidhaa</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            placeholder="Mf. Mchele wa Mbeya (5kg)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bei (TZS)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Idadi ya Stoko</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategoria</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Chagua Kategoria</option>
              <option value="Food & Gifts">Chakula na Vyakula</option>
              <option value="Clothing">Nguo na Mavazi</option>
              <option value="Health & Beauty">Afya na Urembo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eneo / Mahali</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="Dar es Salaam"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mawasiliano (Simu/WhatsApp)</label>
            <input
              type="text"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="+255..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Taarifa za Ufikishaji (Delivery)</label>
            <input
              type="text"
              name="delivery_info"
              required
              value={formData.delivery_info}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="Usafiri unapatikana Mikoani"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Maelezo ya Bidhaa</label>
          <textarea
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            placeholder="Eleza maelezo mafupi ya bidhaa yako..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Picha au Video ya Bidhaa</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files[0])}
            className="mt-1 w-full p-2 text-sm border rounded-lg"
          />
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/business/products')}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Ghairi
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa'}
          </button>
        </div>
      </form>
    </div>
  );
}