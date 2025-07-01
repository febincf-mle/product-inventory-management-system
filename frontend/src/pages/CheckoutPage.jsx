import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';
import NotAuthenticated from '../components/NotAuthenticated';


const CheckoutPage = () => {

  const { cart: cartItems, isLoggedIn } = useAppContext();
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoggedIn) {
    return (
      <NotAuthenticated />
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

            {/* Form + Summary */}
            <div className="checkout-grid">
              {/* Shipping Form */}
                <div className="checkout-form-container">
                  <h1>Items Ordered</h1>
                    <div className="summary-list" id="checkout-order-items">
                      {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                      ) : (
                        cartItems.map(item => (
                          <div key={item.id} className="order-item">
                            <div>
                              <p>{item.quantity}x {item.product_name} - ${item.price.toFixed(2)}</p>
                              <ul>
                                {item.options.map((opt, idx) => (
                                  <li key={idx}>{opt}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-section">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>0</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>0</span>
                    </div>
                  </div>
                  <div className="form-actions">
                    <Link to="/cart" className="btn secondary-btn">Back to Cart</Link>
                    <Link to="/payment" className="btn primary-btn">Continue to Payment</Link>
                  </div>
              </div>


                <div className="summary-total">
                  <span>Total</span>
                  <span>${subTotal.toFixed(2)}</span>
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