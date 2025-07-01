import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppContext } from '../context/AuthContext';
import NotAuthenticated from '../components/NotAuthenticated';
import axiosInstance from '../axiosInstance';

const CartPage = () => {

  const navigate = useNavigate()
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const { cart, setCart, isLoggedIn, addNotification } = useAppContext();

  // Calculate subtotal and total when cartItems or discount changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal);

  }, [cart]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try{
        const response = await axiosInstance.get('actions/cart/')
        setCart(response.data.items)
      }
      catch(err) {

        if (err.response.status == 401) {
          addNotification({
            type: 'warning',
            content: 'You need to login to access this.'
          })
          navigate("/login");
        }
        else {
          addNotification({
            type: 'warning',
            content: 'Error while fetching the cart, please try again later.'
          })
        }
      }
  }

  const handleRemoveCart = async (id) => {
    try {
      const response = await axiosInstance.delete(`actions/cart/remove/${id}/`);
      addNotification({
        type: 'success',
        content: '1x item removed from cart'
      });

      const CartItem = cart.filter(c => c.id === id)[0];
      const remainingItems = cart.filter(c => id !== id);

      if (CartItem.quantity > 1) {
        CartItem.quantity -= 1;
        setCart([...remainingItems, CartItem])
      }else {
        setCart([...remainingItems])
      }
    }
    catch (err) {

      if (err.response.status === 401) {
        addNotification({
          type: 'warning',
          content: 'You need to login.'
        });
      }
      else {
        addNotification({
          type: 'warning',
          content: 'Removing Item failed.'
        }); 
      }
    }
  }

  const isEmpty = cart.length === 0;

  if (!isLoggedIn) {
    return (
      <NotAuthenticated/>
    )
  }

  return (
    <div>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Shopping Cart</h2>
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; Shopping Cart
          </div>
        </div>
      </section>

      {/* Cart Section */}
      <section className="cart-section">
        <div className="container">
          <div className="cart-container">
            {/* Cart Header */}
            <div className="cart-header">
              <div className="cart-header-item product-col">Product</div>
              <div className="cart-header-item price-col">Price</div>
              <div className="cart-header-item quantity-col">Quantity</div>
              <div className="cart-header-item total-col">Total</div>
            </div>

            {/* Cart Items */}
            <div className="cart-items" id="cart-items">
              {isEmpty ? (
                <div className="empty-cart" id="empty-cart">
                  <div className="empty-cart-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <h3>Your Cart is Empty</h3>
                  <p>Looks like you haven't added any items to your cart yet.</p>
                  <Link to="/products" className="btn primary-btn">Continue Shopping</Link>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <img src={`http://127.0.0.1:8000${item.product_image}`} alt={item.product_name} style={{ width: 80, height: 80, marginRight: '1rem' }} />
                    <div style={{ flex: 1 }}>{item.product_name}</div>
                    <div style={{ width: 100 }}>${item.price.toFixed(2)}</div>
                    <div style={{ width: 100 }}>{item.quantity}</div>
                    <div style={{ width: 100 }}>${(item.price * item.quantity).toFixed(2)}</div>
                    <div style={{ width: 100 }}>
                      <button className="btn secondary-btn" style={{backgroundColor: "tomato"}} onClick={() => handleRemoveCart(item.id)}>remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          {/* Cart Summary */}
          {!isEmpty && (
            <div className="cart-summary" id="cart-summary" style={{ marginTop: '2rem' }}>
              <h3>Cart Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span id="cart-subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span id="cart-total">${total.toFixed(2)}</span>
              </div>
              <div className="summary-actions" style={{ marginTop: '1rem' }}>
                <Link to="/checkout" className="btn primary-btn" >Proceed to checkout</Link>
                <Link to="/products" className="btn secondary-btn" style={{ marginLeft: '1rem' }}>Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="recommendations-section">
        <div className="container">
          <h2>You May Also Like</h2>
          <div className="product-grid" id="related-products">
            <p>Related products coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;