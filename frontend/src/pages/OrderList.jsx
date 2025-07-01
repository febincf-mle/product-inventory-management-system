import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import { useAppContext } from '../context/AuthContext';
import NotAuthenticated from '../components/NotAuthenticated'
import '../assets/order-list.css';

const OrderList = () => {

  const { isLoggedIn, addNotification } = useAppContext()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('actions/orders/');
        setOrders(res.data);

      } catch (err) {

        if (err.response.status == 401) {
          addNotification({
            type: 'warning',
            content: 'You need to login to access this'
          })
        }
        else {
          addNotification({
            type: 'warning',
            content: 'Something wrong while fetching orders, please try later'
          })
        }

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <div className="order-list-container"><p>Loading orders...</p></div>;

  if (!isLoggedIn) {
    return (
      <NotAuthenticated />
    )
  }

  return (
    <div className="order-list-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header" onClick={() => toggleExpand(order.id)}>
              <div>
                <strong>Order #{order.id}</strong> - {new Date(order.created_at).toLocaleString()}
              </div>
              <div className="badge">{order.status}</div>
              <div className="amount">₹ {parseFloat(order.total_amount).toFixed(2)}</div>
            </div>

            {expandedOrderId === order.id && (
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <p><strong>{item.product_name}</strong></p>
                    <p>{item.variant_description}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹ {parseFloat(item.price_at_purchase).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;