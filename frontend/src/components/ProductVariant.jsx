import React from 'react';
import { Link } from 'react-router-dom';

const ProductVariant = ({ product }) => {

  const BASE_URL = 'http://localhost:8000'

  const {
    id,
    name,
    image,
    price,
    options,
    stock
  } = product;


  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/variants/${id}`}>
          <img src={`${BASE_URL}${image}`} alt={name} />
        </Link>

        <div className="product-badges">
          {stock > 0 && <span className="badge new">In Stock</span>}
          {stock == 0 && <span className="badge out-of-stock">Out of Stock</span>}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product-details?id=${id}`}>{name}</Link>
        </h3>
        {options?.map(e => {
            return (
                <span>{e.name}: {e.value}</span>
            )
        })}
        <span>{stock} left</span>
        <div className="product-price">
          <span className="current-price">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductVariant;