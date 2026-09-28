import { Routes, Route, Navigate } from 'react-router-dom'
import Products from './features/products/pages/Products'
import CreateProduct from './features/products/pages/CreateProduct'
import EditProduct from './features/products/pages/EditProduct'
import ProductDetails from './features/products/pages/ProductDetails'
import DashboardLayout from './features/products/components/DashboardLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
        <Route path="/dashboard" element={<Navigate to="/products" replace />} />
        <Route path="/orders" element={<Navigate to="/products" replace />} />
        <Route path="/customers" element={<Navigate to="/products" replace />} />
        <Route path="/analytics" element={<Navigate to="/products" replace />} />
        <Route path="/promotions" element={<Navigate to="/products" replace />} />
        <Route path="/shipping" element={<Navigate to="/products" replace />} />
        <Route path="/settings" element={<Navigate to="/products" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}