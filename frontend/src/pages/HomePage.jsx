import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Product from '../components/Product'; 
import axiosInstance from '../axiosInstance'


const HomePage = () => {

  const [ featuredProducts, setFeaturedProducts ] = useState([]);
  useEffect(() => {

    async function fetchFeaturedProducts() {
      try {
        const response = await axiosInstance.get("products/?featured=true");
        if (response.status == 200) {
          setFeaturedProducts(response.data.results)
        }
      }catch(err) {
        alert(err)
      }
    }
    fetchFeaturedProducts()
  }, [])

  // Dummy categories for design.
  // will be made dynamic in the future.
  const categories = [
    { iconClass: 'fas fa-tshirt', name: 'Clothing', slug: 'clothing' },
    { iconClass: 'fas fa-mobile-alt', name: 'Electronics', slug: 'electronics' },
    { iconClass: 'fas fa-gem', name: 'Jewelry', slug: 'jewelry' },
    { iconClass: 'fas fa-home', name: 'Home & Living', slug: 'home' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h2>Summer Sale</h2>
            <p>Get up to 50% off on our latest collection</p>
            <Link to="/products" className="btn primary-btn">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Shop by Category</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.slug}>
                <div className="category-icon">
                  <i className={category.iconClass}></i>
                </div>
                <h3>{category.name}</h3>
                <Link to={`/products?category=${category.slug}`} className="btn small-btn">
                  View All
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
          </div>
          <div className="products-grid" id="featured-products-container">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Product key={product.product_id} product={product} />
              ))
            ) : (
              <p>No featured products available.</p>
            )}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="btn secondary-btn">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="special-offer">
        <div className="container">
          <div className="offer-content">
            <h2>Special Offer</h2>
            <p>Get an extra 10% off on your first purchase</p>
            <p>Use code: <span className="promo-code">FIRST10</span></p>
            <Link to="/products" className="btn primary-btn">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get updates on new products and special offers</p>
            <form id="newsletter-form" className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn primary-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;