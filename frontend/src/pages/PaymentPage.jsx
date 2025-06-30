import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAppContext } from '../context/AuthContext';

const PaymentPage = () => {

  const { isLoggedIn } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Dummy function for processing payment
    // Replace with real API integration or Stripe SDK later
    console.log(`Paying with: ${paymentMethod}`);
    try {
      const response = await axiosInstance.post('actions/orders/create/');
      console.log(response);
      console.log(response.status);
      
      if (response.status == 201) {
        navigate("/checkout-confirmation")
      }
    }catch(err) {
      console.log(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <Link to="/login">Login to access this page</Link>
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
              <h3>Payment Method</h3>
              <div className="payment-methods">
                {['card', 'paypal', 'stripe'].map((method) => (
                  <div
                    key={method}
                    className={`payment-method ${paymentMethod === method ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <div className="method-radio">
                      <input
                        type="radio"
                        id={`${method}-method`}
                        name="payment-method"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <label htmlFor={`${method}-method`}>
                        {method === 'card' ? 'Credit/Debit Card' : method.charAt(0).toUpperCase() + method.slice(1)}
                      </label>
                    </div>
                    <div className="method-icon">
                      <i className={
                        method === 'card' ? 'far fa-credit-card' :
                        method === 'paypal' ? 'fab fa-paypal' :
                        'fab fa-stripe-s'
                      }></i>
                    </div>
                  </div>
                ))}
              </div>

              {/* Forms based on method */}
              {paymentMethod === 'card' && (
                <div className="payment-form" id="card-form">
                  <div className="form-group">
                    <label htmlFor="card-holder">Cardholder Name</label>
                    <input type="text" id="card-holder" placeholder="Name on card" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-number">Card Number</label>
                    <div className="card-number-input">
                      <input type="text" id="card-number" placeholder="1234 5678 9012 3456" />
                      <div className="card-icons">
                        <i className="fab fa-cc-visa"></i>
                        <i className="fab fa-cc-mastercard"></i>
                        <i className="fab fa-cc-amex"></i>
                        <i className="fab fa-cc-discover"></i>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="card-expiry">Expiration Date</label>
                      <input type="text" id="card-expiry" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-cvc">CVC Code</label>
                      <input type="text" id="card-cvc" placeholder="CVC" />
                    </div>
                  </div>
                  <div className="form-info">
                    <i className="fas fa-lock"></i>
                    <p>Your payment information is securely processed through our PCI-compliant platform.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="payment-form" id="paypal-form">
                  <div className="paypal-content">
                    <div className="paypal-icon">
                      <i className="fab fa-paypal"></i>
                    </div>
                    <p>You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <div className="payment-form" id="stripe-form">
                  <div className="stripe-content">
                    <div className="stripe-icon">
                      <i className="fab fa-stripe-s"></i>
                    </div>
                    <div className="stripe-element-placeholder">
                      <div className="card-element-placeholder"></div>
                    </div>
                    <p>Secure payment processing by Stripe.</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="payment-actions">
                <Link to="/checkout" className="btn secondary-btn">Back to Shipping</Link>
                <button type="submit" className="btn primary-btn" id="pay-now-btn">Pay Now</button>
              </div>
            </form>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-list" id="payment-order-items">
                {/* Dynamically render cart items */}
                <p>Sample Product 1 - $25.00</p>
              </div>
              <div className="summary-section">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>$25.00</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>$2.50</span>
                </div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>$32.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
