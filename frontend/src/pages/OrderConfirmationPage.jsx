import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';
import NotAuthenticated from '../components/NotAuthenticated';


const OrderConfirmationPage = () => {

  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return (
      <NotAuthenticated />
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
