import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext';
import NotAuthenticated from '../components/NotAuthenticated';
import axiosInstance from '../axiosInstance';

import '../assets/create-product.css';
const ProductForm = () => {

  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    ProductName: '',
    ProductID: '',
    ProductCode: '',
    TotalStock: 0,
    Category: '',
    is_new: true,
    in_stock: true,
    rating: 0,
    review_count: 0,
    discount: 0,
    old_price: 0,
    price: 0,
    variants: [],
    combinations: [],
    ProductImage: null,
  });
  

  const [newVariant, setNewVariant] = useState({ name: '', options: [''] });
  const [newCombination, setNewCombination] = useState({
    sku: '',
    description: '',
    stock: 0,
    options: [],
  });

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prev) => ({
      ...prev,
      ProductImage: file,
    }));
  };

  const handleVariantChange = (e, index) => {
    const newOptions = [...newVariant.options];
    newOptions[index] = e.target.value;
    setNewVariant({ ...newVariant, options: newOptions });
  };

  const addVariantOption = () => {
    setNewVariant((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.options.length > 0) {
      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, newVariant],
      }));
      setNewVariant({ name: '', options: [''] });
    }
  };

  const addCombination = () => {
    if (newCombination.sku && newCombination.options.length > 0) {
      setProduct((prev) => ({
        ...prev,
        combinations: [...prev.combinations, newCombination],
      }));
      setNewCombination({ sku: '', description: '', stock: 0, options: [] });
    }
  };

  const handleCombinationOptionChange = (index, value) => {
    const updated = [...newCombination.options];
    updated[index] = value;
    setNewCombination((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('ProductName', product.ProductName);
      formData.append('ProductID', product.ProductID);
      formData.append('ProductCode', product.ProductCode);
      formData.append('TotalStock', product.TotalStock);
      formData.append('Category', product.Category);
      formData.append('is_new', product.is_new);
      formData.append('in_stock', product.in_stock);
      formData.append('rating', product.rating);
      formData.append('review_count', product.review_count);
      formData.append('discount', product.discount);
      formData.append('old_price', product.old_price);
      formData.append('price', product.price);

      // Append image
      if (product.ProductImage) {
        formData.append('ProductImage', product.ProductImage);
      }

      // Append variants as JSON string
      formData.append('variants', JSON.stringify(product.variants));

      // Append combinations as JSON string
      formData.append('combinations', JSON.stringify(product.combinations));

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Submit to backend
      const response = await axiosInstance.post('products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product submitted successfully!');
      setProduct({
        ProductName: '',
        ProductID: '',
        ProductCode: '',
        TotalStock: 0,
        Category: '',
        is_new: true,
        in_stock: true,
        rating: 0,
        review_count: 0,
        discount: 0,
        old_price: 0,
        price: 0,
        variants: [],
        combinations: [],
        ProductImage: null,
      });

      setNewVariant({ name: '', options: [''] });

      setNewCombination({
        sku: '',
        description: '',
        stock: 0,
        options: [],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit.');
    }
  };

  if (!isLoggedIn) {
    return (
      <NotAuthenticated />
    )
  }

  return (
    <div className="product-form-container">
      <h2>Create Product</h2>

      <div className="form-group">
        <label htmlFor="ProductName">Product Name</label>
        <input
          type="text"
          id="ProductName"
          name="ProductName"
          placeholder="Product Name"
          value={product.ProductName}
          onChange={handleProductChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="ProductImage">Product Image</label>
        <input
          type="file"
          id="ProductImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ProductID">Product ID</label>
          <input
            type="text"
            id="ProductID"
            name="ProductID"
            placeholder="Product ID"
            value={product.ProductID}
            onChange={handleProductChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ProductCode">Product Code</label>
          <input
            type="text"
            id="ProductCode"
            name="ProductCode"
            placeholder="Product Code"
            value={product.ProductCode}
            onChange={handleProductChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="TotalStock">Total Stock</label>
          <input
            type="number"
            step="1"
            id="TotalStock"
            name="TotalStock"
            placeholder="Available Stock"
            value={product.TotalStock}
            onChange={handleProductChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Category">Category</label>
          <input
            type="text"
            id="Category"
            name="Category"
            placeholder="Category Name"
            value={product.Category}
            onChange={handleProductChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            step="any"
            id="price"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleProductChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="old_price">Old Price</label>
          <input
            type="number"
            step="any"
            id="old_price"
            name="old_price"
            placeholder="Old Price"
            value={product.old_price}
            onChange={handleProductChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            step="any"
            id="discount"
            name="discount"
            placeholder="Discount"
            value={product.discount}
            onChange={handleProductChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            step="any"
            id="rating"
            name="rating"
            placeholder="Rating"
            value={product.rating}
            onChange={handleProductChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="review_count">Review Count</label>
          <input
            type="number"
            step="1"
            id="review_count"
            name="review_count"
            placeholder="Reviews"
            value={product.review_count}
            onChange={handleProductChange}
          />
        </div>
      </div>

      <div className="checkbox-group">
        <label htmlFor="is_new">
          <input
            type="checkbox"
            id="is_new"
            name="is_new"
            checked={product.is_new}
            onChange={handleProductChange}
          />{' '}
          New
        </label>
        <label htmlFor="in_stock">
          <input
            type="checkbox"
            id="in_stock"
            name="in_stock"
            checked={product.in_stock}
            onChange={handleProductChange}
          />{' '}
          In Stock
        </label>
      </div>

      <hr />

      <h3>Add Variant</h3>
      <div className="form-group">
        <label htmlFor="variantName">Variant Name</label>
        <input
          type="text"
          id="variantName"
          placeholder="Variant Name"
          value={newVariant.name}
          onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
        />
      </div>
      {newVariant.options.map((opt, i) => (
        <div className="form-group" key={i}>
          <label htmlFor={`option${i}`}>Option {i + 1}</label>
          <input
            type="text"
            id={`option${i}`}
            value={opt}
            onChange={(e) => handleVariantChange(e, i)}
          />
        </div>
      ))}
      <div className="button-group">
        <button type="button" onClick={addVariantOption}>
          Add Option
        </button>
        <button type="button" onClick={addVariant}>
          Add Variant
        </button>
      </div>

      <hr />

      <h3>Add Combination</h3>
      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input
          type="text"
          id="sku"
          placeholder="SKU"
          value={newCombination.sku}
          onChange={(e) => setNewCombination((prev) => ({ ...prev, sku: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          placeholder="Description"
          value={newCombination.description}
          onChange={(e) => setNewCombination((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          step="1"
          id="stock"
          placeholder="Stock"
          value={newCombination.stock}
          onChange={(e) => setNewCombination((prev) => ({ ...prev, stock: parseInt(e.target.value) }))}
        />
      </div>

      {product.variants.map((variant, idx) => (
        <div className="form-group" key={idx}>
          <label htmlFor={`combination-option-${idx}`}>{variant.name}</label>
          <select
            id={`combination-option-${idx}`}
            onChange={(e) => handleCombinationOptionChange(idx, e.target.value)}
            value={newCombination.options[idx] || ''}
          >
            <option value="">Select {variant.name}</option>
            {variant.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="button-group">
        <button type="button" onClick={addCombination}>
          Add Combination
        </button>
      </div>

      <hr />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Product
      </button>

      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
};

export default ProductForm;