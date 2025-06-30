import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './assets/custom.css'
import './assets/responsive.css'
import './assets/styles.css'

import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'
import CreateProduct from './pages/CreateProduct.jsx'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import PaymentPage from './pages/PaymentPage'
import Products from './pages/Products'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import ProductVariantsPage from './pages/ProductVariants.jsx';
import VariantDetailPage from './pages/VariantDetailPage.jsx';
import OrderList from './pages/OrderList.jsx'
import AuthProvider from './context/AuthContext.jsx'

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/products/:id" element={<ProductVariantsPage />} />
            <Route path="/products/variant/:id" element={<VariantDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/checkout-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<OrderList />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </>
  )
}

export default App