import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './features/products/pages/Products';
import CreateProduct from './features/products/pages/CreateProduct';
import EditProduct from './features/products/pages/EditProduct';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/business/products" element={<Products />} />
        <Route path="/business/products/create" element={<CreateProduct />} />
        <Route path="/business/products/edit/:id" element={<EditProduct />} />
        <Route path="*" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}
