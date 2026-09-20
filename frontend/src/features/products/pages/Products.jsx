import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Delete modal state
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({ search, category });
      setProducts(data || []);
    } catch (err) {
      setError('Imeshindwa kupakia bidhaa. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleDeactivate = async () => {
    if (!selectedProductId) return;
    try {
      await productService.deleteProduct(selectedProductId);
      setProducts(products.filter((p) => p.id !== selectedProductId));
      setSelectedProductId(null);
    } catch (err) {
      alert('Imeshindwa kuondoa bidhaa.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dhibiti Bidhaa Zako</h1>
          <p className="text-sm text-gray-500">Orodha na usimamizi wa stoko ya duka lako</p>
        </div>
        <Link
          to="/business/products/create"
          className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
        >
          + Ongeza Bidhaa Mpya
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <input
          type="text"
          placeholder="Tafuta bidhaa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] p-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
        >
          <option value="">Kategoria Zote</option>
          <option value="Food & Gifts">Chakula na Vyakula</option>
          <option value="Clothing">Nguo na Mavazi</option>
          <option value="Health & Beauty">Afya na Urembo</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Inapakia bidhaa...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Hujaongeza bidhaa yoyote bado.</p>
          <Link
            to="/business/products/create"
            className="inline-block mt-3 text-sm text-purple-600 font-semibold hover:underline"
          >
            Bonyeza hapa kuongeza bidhaa ya kwanza
          </Link>
        </div>
      )}

      {/* Product Table */}
      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-3">Picha</th>
                <th className="p-3">Jina la Bidhaa</th>
                <th className="p-3">Bei (TZS)</th>
                <th className="p-3">Stoko</th>
                <th className="p-3">Kategoria</th>
                <th className="p-3 text-right">Matendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/40'}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">{product.name}</td>
                  <td className="p-3">TZS {product.price?.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {product.stock} kwenye stoko
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{product.category}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/business/products/edit/${product.id}`}
                      className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      Hariri
                    </Link>
                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="px-2.5 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100"
                    >
                      Ondoa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-gray-800">Thibitisha Kufuta</h3>
            <p className="text-sm text-gray-600">
              Je, una uhakika unataka kuondoa bidhaa hii kwenye mfumo?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedProductId(null)}
                className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ndio, Ondoa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}