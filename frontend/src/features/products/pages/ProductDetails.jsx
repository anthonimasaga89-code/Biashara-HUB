import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Imeshindwa kupakia taarifa za bidhaa.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-500">Inapakia taarifa...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <Link
          to={`/business/products/edit/${product.id}`}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
        >
          Hariri Bidhaa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>

        <div className="space-y-3">
          <p className="text-2xl font-bold text-purple-600">
            TZS {product.price?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Stoko:</span> {product.stock} zimebaki
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Kategoria:</span> {product.category}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Eneo:</span> {product.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Mawasiliano:</span> {product.contact}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Ufikishaji:</span> {product.delivery_info}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Maelezo</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}