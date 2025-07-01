import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import axiosInstance from '../axiosInstance';
import { useAppContext } from '../context/AuthContext';

import '../assets/variant.css';


const VariantDetailPage = () => {

  const { id } = useParams();
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addNotification, setCart } = useAppContext();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const res = await axiosInstance.get(`products/variant-combinations/${id}/`);
        setVariant(res.data);
      } catch (err) {
        addNotification({
          type: 'warning',
          content: 'Error while fetching the variant data.'
        })
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [id]);

  const increaseQty = () => {
    if (quantity < variant.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  async function handleAddToCart() {
    setLoading(true)

    try {
      const response = await axiosInstance.post('/actions/cart/add/', {
        'product_variant': variant.id,
        'quantity': quantity,
      })

      const cartResponse = await axiosInstance.get('/actions/cart/')
      setCart(cartResponse.data.items)
       
      if (response.status == 201) {
        addNotification({
          type: 'success',
          content: "product added to cart successfully"
        })
      }

      navigate("/cart");

    } catch (err) {
      
      if (err.status == 401) {
        addNotification({
          type: 'warning',
          content: "You must login to buy the product."
        })
        navigate("/login");
      }

      else if (err.status == 400) {
        addNotification({
          type: 'warning',
          content: 'Not enough stock avaiable, check your cart.'
        })
      }
    } 
    finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="v1-container"><p>Loading...</p></div>;
  if (!variant) return <div className="v1-container"><h3>Variant not found</h3></div>;

  return (
    <section className="v1-variant-detail-container">
      <div className="v1-variant-breadcrumbs">
        <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{variant.product_name}</span>
      </div>

      <div className="v1-variant-card">
        <div className="v1-variant-image">
          <img src={`http://127.0.0.1:8000${variant.image || '/default.jpg'}`} alt={variant.sku} />
        </div>

        <div className="v1-variant-info">
          <h2>{variant.product_name}</h2>
          <h4>SKU: {variant.sku}</h4>

          <div className="v1-variant-options">
            {variant.options.map(opt => (
              <div key={opt.name} className="v1-option-pair">
                <strong>{opt.name}:</strong> {opt.value}
              </div>
            ))}
          </div>

          <p><strong>Price:</strong> ₹{variant.price}</p>
          <p><strong>Stock Available:</strong> {variant.stock}</p>

          <div className="v1-quantity-actions">
            <button onClick={decreaseQty}>-</button>
            <input type="number" readOnly value={quantity} />
            <button onClick={increaseQty}>+</button>
          </div>

          <div className="v1-button-actions">
            <button className="v1-btn v1-primary-btn" onClick={handleAddToCart} disabled={variant.stock < 1}>Add to Cart</button>
            <button className="v1-btn v1-secondary-btn">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VariantDetailPage;