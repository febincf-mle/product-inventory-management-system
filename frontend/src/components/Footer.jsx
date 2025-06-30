import { Link } from 'react-router-dom';

const Footer = () => {
  const handleDummyClick = (e) => {
    e.preventDefault();
    console.log("Link clicked");
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Branding */}
          <div className="footer-column">
            <h3>ShopEasy</h3>
            <p>Your one-stop shop for all your needs. Quality products at affordable prices.</p>
            <div className="social-links">
              <a href="#" onClick={handleDummyClick}><i className="fab fa-facebook-f"></i></a>
              <a href="#" onClick={handleDummyClick}><i className="fab fa-twitter"></i></a>
              <a href="#" onClick={handleDummyClick}><i className="fab fa-instagram"></i></a>
              <a href="#" onClick={handleDummyClick}><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><a href="#" onClick={handleDummyClick}>About Us</a></li>
              <li><a href="#" onClick={handleDummyClick}>Contact</a></li>
              <li><a href="#" onClick={handleDummyClick}>FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-column">
            <h3>Categories</h3>
            <ul className="footer-links">
              <li><Link to="/products?category=clothing">Clothing</Link></li>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=jewelry">Jewelry</Link></li>
              <li><Link to="/products?category=home">Home & Living</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> 123 Shop Street, City, Country</li>
              <li><i className="fas fa-phone"></i> +1 234 567 890</li>
              <li><i className="fas fa-envelope"></i> info@shopeasy.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p>&copy; 2023 ShopEasy. All Rights Reserved.</p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-amex"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;