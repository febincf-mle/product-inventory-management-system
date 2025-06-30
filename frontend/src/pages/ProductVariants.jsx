import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import axiosInstance from '../axiosInstance';
import '../assets/product-variant.css'; 

const ProductVariantsPage = () => {

  const { id } = useParams();
  const [variants, setVariants] = useState([]);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await axiosInstance.get(`products/${id}/combinations/`);
        setVariants(res.data.variants || []);
        setProductName(res.data.product_name || '');
      } catch (error) {
        alert("Error fetching related data.")
        console.error('Error fetching product variants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVariants();
  }, [id]);

  return (
    <>
      <section className="variant-banner">
        <div className="variant-container">
          <h2 className="variant-title">{productName} Variants</h2>
          <nav className="variant-breadcrumbs">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">&gt;</span>
            <Link to="/products" className="breadcrumb-link">Products</Link>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Variants</span>
          </nav>
        </div>
      </section>

      <section className="variant-list-section">
        <div className="variant-container">
          {loading ? (
            <p className="variant-loading">Loading variants...</p>
          ) : variants.length === 0 ? (
            <p className="variant-empty">No variants available for this product.</p>
          ) : (
            <div className="variant-grid">
              {variants.map(variant => (
                <div className="variant-card" key={variant.id}>
                  <div className="variant-image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000${variant.image || '/default.jpg'}`}
                      alt={variant.sku}
                      className="variant-image"
                    />
                  </div>
                  <div className="variant-details">
                    <h3 className="variant-sku">{variant.sku}</h3>
                    <div className="variant-options">
                      {variant.options.map(opt => (
                        <div className="variant-option" key={opt.name}>
                          <span className="option-label">{opt.name}:</span>
                          <span className="option-value">{opt.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="variant-meta">
                      <p className="variant-price">₹{variant.price}</p>
                      <p className="variant-stock">Stock: {variant.stock}</p>
                    </div>
                    <Link to={`/products/variant/${variant.id}`} className="variant-button">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductVariantsPage;