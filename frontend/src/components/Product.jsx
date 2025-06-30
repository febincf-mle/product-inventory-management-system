import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {

  const BASE_URL = 'http://localhost:8000'
  const {
    id,
    ProductImage,
    ProductName,
    Category,
    is_new,
    discount,
    in_stock,
    rating,
    review_count,
    old_price,
    price,
  } = product;

  const handleQuickView = () => {
    console.log("Quick view for product:", id);
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist:", id);
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", id);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-full-${i}`} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="star-half" className="fas fa-star-half-alt"></i>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`star-empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/${id}`}>
          <img src={`${BASE_URL}${ProductImage}`} alt={ProductName} />
        </Link>

        <div className="product-badges">
          {is_new && <span className="badge new">New</span>}
          {discount && <span className="badge sale">-{discount}%</span>}
          {!in_stock && <span className="badge out-of-stock">Out of Stock</span>}
        </div>

        <div className="product-actions">
          <button className="action-btn quick-view" onClick={handleQuickView}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="action-btn add-to-wishlist" onClick={handleAddToWishlist}>
            <i className="far fa-heart"></i>
          </button>
          <button
            className="action-btn add-to-cart"
            onClick={handleAddToCart}
            disabled={!in_stock}
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{Category?.name}</div>
        <h3 className="product-title">
          <Link to={`/product-details?id=${id}`}>{ProductName}</Link>
        </h3>

        <div className="product-rating">
          <div className="stars">{renderStars()}</div>
          <span className="review-count">({review_count})</span>
        </div>

        <div className="product-price">
          {old_price && <span className="old-price">{old_price}</span>}
          <span className="current-price">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;