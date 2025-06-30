import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';

const OrderConfirmationPage = () => {
  
  // Dummy data — replace with props, context, or API data as needed
  const order = {
    id: '12345',
    date: 'June 28, 2025',
    total: 249.99,
    email: 'email@example.com',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Street, City, Country',
    items: [
      { name: 'Sample Product', quantity: 2, price: 49.99 },
      { name: 'Another Item', quantity: 1, price: 149.99 },
    ]
  };

  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return (
      <Link to="/login">Login to access this page</Link>
    )
  }

  return (
    <div>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Order Confirmation</h2>
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; Order Confirmation
          </div>
        </div>
      </section>

      {/* Confirmation Section */}
      <section className="confirmation-section">
        <div className="container">
          <div className="confirmation-container">
            {/* Step Tracker */}
            <div className="checkout-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-title">Shipping</div>
              </div>
              <div className="step-connector"></div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-title">Payment</div>
              </div>
              <div className="step-connector"></div>
              <div className="step active">
                <div className="step-number">3</div>
                <div className="step-title">Confirmation</div>
              </div>
            </div>

            {/* Order Success Message */}
            <div className="order-success">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Thank You For Your Order!</h3>
              <p>Your order has been placed and is being processed. Your order number is <strong>#{order.id}</strong>.</p>
              <p>You will receive an email confirmation shortly at <strong>{order.email}</strong>.</p>

              {/* Order Details */}
              <div className="order-details">
                <h4>Order Details</h4>
                <div className="order-info">
                  <div className="info-item">
                    <span className="info-label">Order Number:</span>
                    <span className="info-value">{order.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{order.date}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">{order.paymentMethod}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Shipping Address:</span>
                    <span className="info-value">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="ordered-items">
                <h4>Ordered Items</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="confirmation-actions">
                <Link to="/" className="btn primary-btn">Continue Shopping</Link>
                <Link to="/orders" className="btn secondary-btn">View My Orders</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderConfirmationPage;
