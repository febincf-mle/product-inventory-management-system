import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Login from './pages/Login';
import Register from './pages/Register'
import CreateProduct from './pages/CreateProduct'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import PaymentPage from './pages/PaymentPage'
import Products from './pages/Products'
import ProductVariantsPage from './pages/ProductVariants.jsx';
import VariantDetailPage from './pages/VariantDetailPage.jsx';
import OrderList from './pages/OrderList.jsx'
import AuthProvider, { useAppContext } from './context/AuthContext.jsx'

import './assets/custom.css'
import './assets/responsive.css'
import './assets/styles.css'

function App() {

  const { isLoggedIn } = useAppContext

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
              <Route path="/products/:id" element={<ProductVariantsPage />} />
              <Route path="/products/variant/:id" element={<VariantDetailPage />} />

              <Route path="/create" element={<CreateProduct />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/checkout-confirmation" element={<OrderConfirmationPage />} />

            </Routes>
            <Footer />
          </Router>
      </AuthProvider>
    </>
  )
}

export default App