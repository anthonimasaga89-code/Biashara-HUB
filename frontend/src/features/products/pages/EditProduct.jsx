import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          stock: data.stock || '',
          category: data.category || '',
          location: data.location || '',
          contact: data.contact || '',
          delivery_info: data.delivery_info || '',
        });
      } catch (err) {
        setError('Imeshindwa kupakia taarifa za bidhaa.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await productService.updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });
      navigate('/business/products');
    } catch (err) {
      setError('Imeshindwa kuhifadhi marekebisho.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Inapakia taarifa...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Hariri Bidhaa</h2>
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

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
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bei (TZS)</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Idadi ya Stoko</label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
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
          />
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
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? 'Inahifadhi...' : 'Leta Mabadiliko'}
          </button>
        </div>
      </form>
    </div>
  );
}