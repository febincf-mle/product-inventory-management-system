import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance'

import Product from '../components/Product';

const ProductsPage = () => {

  // State variables for Products and Categories.
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // State variables for handling query parameters.
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratings, setRatings] = useState([]);
  const [sort, setSort] = useState('featured');

  // State variables for handling pagination.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch products from the backend.
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (!selectedCategories.includes('all')) {
        params.append('categories', selectedCategories.join(','));
      }

      if (priceRange[0] !== 0) params.append('min_price', priceRange[0]);
      if (priceRange[1] !== 1000) params.append('max_price', priceRange[1]);

      if (ratings.length > 0) {
        params.append('ratings', ratings.join(','));
      }

      if (sort !== 'featured') {
        params.append('sort', sort);
      }

      params.append('page', currentPage);
      params.append('page_size', pageSize);

      const response = await axiosInstance.get(`products/?${params.toString()}`);
      const data = response.data;
      
      setProducts(data.results || []);
      setTotalCount(data.count || 0);
      setTotalPages(data.total_pages || 1);

      if (categories.length === 0 && data.results?.length > 0) {
        const allCats = Array.from(new Set(data.results.map(p => p.Category)));
        setCategories(allCats);
      }
    } catch (error) {
      alert("Error happened when applying filters.")
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, priceRange, ratings, sort, currentPage]);

  const clearFilters = () => {
    setSelectedCategories(['all']);
    setPriceRange([0, 1000]);
    setRatings([]);
    setSort('featured');
    setCurrentPage(1);
  };

  const toggleCategory = (value) => {
    if (value === 'all') {
      setSelectedCategories(['all']);
    } else {
      let updated = selectedCategories.includes('all') ? [] : [...selectedCategories];
      if (updated.includes(value)) {
        updated = updated.filter(c => c !== value);
      } else {
        updated.push(value);
      }
      setSelectedCategories(updated);
    }
    setCurrentPage(1);
  };

  const toggleRating = (value) => {
    const num = parseInt(value);
    if (ratings.includes(num)) {
      setRatings(ratings.filter(r => r !== num));
    } else {
      setRatings([...ratings, num]);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h2>Products</h2>
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; Products
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-layout">
            <aside className="filters-sidebar">
              {/* Categories Filter */}
              <div className="filter-group">
                <h3>Categories</h3>
                <ul className="filter-list">
                  <li>
                    <input type="checkbox" id="category-all" checked={selectedCategories.includes('all')} onChange={() => toggleCategory('all')} />
                    <label htmlFor="category-all">All Categories</label>
                  </li>
                  {categories.map(cat => (
                    <li key={cat}>
                      <input
                        type="checkbox"
                        id={`category-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <label htmlFor={`category-${cat}`}>{cat?.charAt(0).toUpperCase() + cat?.slice(1)}</label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <h3>Price Range</h3>
                <input type="range" min="0" max="1000" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} />
                <input type="range" min="0" max="1000" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
                <div className="price-inputs">
                  <div>
                    <label>Min:</label>
                    <input type="number" min="0" max="1000" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} />
                  </div>
                  <div>
                    <label>Max:</label>
                    <input type="number" min="0" max="1000" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <h3>Rating</h3>
                <ul className="filter-list rating-filters">
                  {[5, 4, 3, 2, 1].map(r => (
                    <li key={r}>
                      <input type="checkbox" id={`rating-${r}`} value={r} checked={ratings.includes(r)} onChange={() => toggleRating(r)} />
                      <label htmlFor={`rating-${r}`}>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < r ? 'fas fa-star' : 'far fa-star'}></i>
                          ))}
                          {r < 5 && ' & Up'}
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="btn primary-btn" onClick={fetchProducts}>Apply Filters</button>
              <button className="btn secondary-btn" onClick={clearFilters}>Clear Filters</button>
            </aside>

            {/* Product Content */}
            <div className="products-content">
              <div className="products-header">
                <div className="products-count">
                  <p>
                    Showing <span>{products.length}</span> of <span>{totalCount}</span> products
                  </p>
                </div>
                <div className="products-sort">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {products.length > 0 ? (
                  products.map(product => (
                    <Product key={product.id} product={product} />
                  ))
                ) : (
                  <p className="no-products">No products match your criteria. Please try different filters.</p>
                )}
              </div>

              {/* Updated Pagination */}
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>

                <button className="page-number active" disabled>
                  {currentPage}
                </button>

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;