import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router is used

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // Replace with API data
  const [recommendedProducts, setRecommendedProducts] = useState([]); // Replace with API data

  // Dummy effects to simulate data fetching
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchedWishlistItems = []; // e.g., [{ id: 1, name: "Product 1", ... }]
    setWishlistItems(fetchedWishlistItems);

    const fetchedRecommendedProducts = []; // e.g., [{ id: 101, name: "Recommended Product", ... }]
    setRecommendedProducts(fetchedRecommendedProducts);
  }, []);

  const addAllToCart = () => {
    // Dummy handler function
    console.log("Add all to cart");
  };

  const clearWishlist = () => {
    // Dummy handler function
    setWishlistItems([]);
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h2>My Wishlist</h2>
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; My Wishlist
          </div>
        </div>
      </section>

      <section className="wishlist-section">
        <div className="container">
          <div className="wishlist-container">
            <div className="wishlist-header">
              <h3>Saved Items (<span className="wishlist-count">{wishlistItems.length}</span>)</h3>

              {wishlistItems.length > 0 && (
                <div className="wishlist-actions" id="wishlist-actions">
                  <button className="btn secondary-btn" onClick={addAllToCart}>
                    Add All to Cart
                  </button>
                  <button className="btn text-btn" onClick={clearWishlist}>
                    Clear Wishlist
                  </button>
                </div>
              )}
            </div>

            <div className="wishlist-grid" id="wishlist-items">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item.id} className="wishlist-item-card">
                    {/* Render item details */}
                    <p>{item.name}</p>
                  </div>
                ))
              ) : (
                <div className="empty-wishlist" id="empty-wishlist">
                  <div className="empty-wishlist-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h3>Your Wishlist is Empty</h3>
                  <p>Save items you like to your wishlist and they'll show up here.</p>
                  <Link to="/" className="btn primary-btn">Start Shopping</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="recommendations-section">
        <div className="container">
          <h2>You May Also Like</h2>
          <div className="product-grid" id="recommended-products">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="recommended-product-card">
                {/* Render product details */}
                <p>{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishlistPage;
