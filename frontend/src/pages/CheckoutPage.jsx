import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';

import axiosInstance from '../axiosInstance';

const CheckoutPage = () => {

  const navigate = useNavigate();
  const { cart: cartItems, isLoggedIn } = useAppContext();

  // Shipping form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    saveInfo: false,
    shippingMethod: 'standard',
  });

  // Dummy summary state
  const [summary, setSummary] = useState({
    subtotal: 100,
    shipping: 10,
    tax: 5,
    discount: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    navigate('/payment'); // Replace with your actual payment route
  };

  const total = summary.subtotal + summary.shipping + summary.tax - summary.discount;

  if (!isLoggedIn) {
    return (
      <Link to="/login">Login to access this page</Link>
    )
  }

  return cartItems && (
    <div>
      {/* Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Checkout</h2>
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; <Link to="/cart">Cart</Link> &gt; Checkout
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="checkout-section">
        <div className="container">
          <div className="checkout-container">
            {/* Steps */}


            {/* Form + Summary */}
            <div className="checkout-grid">
              {/* Shipping Form */}
                <div className="checkout-form-container">
                  <h1>Items Ordered</h1>
                  <div className="summary-list" id="checkout-order-items">
                    <div className="summary-list" id="checkout-order-items">
                      {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                      ) : (
                        cartItems.map(item => (
                          <div key={item.id} className="order-item">
                            <p>
                              {item.quantity}x {item.product_name} - ${item.price.toFixed(2)}
                            </p>
                            <ul>
                              {item.options.map((opt, idx) => (
                                <li key={idx}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-section">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>${summary.shipping.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>${summary.tax.toFixed(2)}</span>
                    </div>
                    {summary.discount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Discount</span>
                      <span>-${summary.discount.toFixed(2)}</span>
                    </div>
                    )}
                  </div>
                  <div className="form-actions">
                    <Link to="/cart" className="btn secondary-btn">Back to Cart</Link>
                    <Link to="/payment" className="btn primary-btn">Continue to Payment</Link>
                  </div>
              </div>


                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;