import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import NotAuthenticated from '../components/NotAuthenticated';
import { useAppContext } from '../context/AuthContext';

const PaymentPage = () => {

  const { isLoggedIn, addNotification, setCart } = useAppContext();
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('actions/orders/create/');
      
      if (response.status == 201) {
        addNotification({
          type: 'success',
          content: 'Order placed.'
        })
        setCart([]);
        navigate("/checkout-confirmation");
      }

    }catch(err) {
      if (err.response.status == 401) {
        addNotification({
          type: 'warning',
          content: 'Not logged in.'
        })
        navigate("/login")
      }
      else {
        addNotification({
          type: 'warning',
          content: 'Order not placed!!'
        })
        console.log(err.response);
        navigate("/cart")
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <NotAuthenticated />
    )
  }

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-container">

          {/* Checkout Steps */}
          <div className="checkout-steps">
            <div className="step completed">
              <div className="step-number">1</div>
              <div className="step-title">Shipping</div>
            </div>
            <div className="step-connector"></div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-title">Payment</div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-title">Confirmation</div>
            </div>
          </div>

          {/* Payment Form and Order Summary */}
          <div className="payment-grid">
            <form className="payment-options" onSubmit={handlePaymentSubmit}>

              <div className="payment-form" id="stripe-form">
                <div className="stripe-content">
                  <div className="stripe-element-placeholder">
                    <div className="card-element-placeholder"></div>
                  </div>
                  <p>Secure payment processing by Stripe.</p>
                </div>
              </div>

              <div className="payment-actions">
                <Link to="/checkout" className="btn secondary-btn">Back to Shipping</Link>
                <button type="submit" className="btn primary-btn" id="pay-now-btn">Pay Now</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
