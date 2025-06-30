import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    subscribed: true
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home Address',
      isDefault: true,
      name: 'John Doe',
      addressLine1: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
      country: 'United States',
      phone: '+1 234 567 890'
    },
    {
      id: 2,
      label: 'Work Address',
      isDefault: false,
      name: 'John Doe',
      addressLine1: '456 Business Avenue',
      city: 'New York, NY 10002',
      country: 'United States',
      phone: '+1 234 567 890'
    }
  ]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [id.replace('profile-', '')]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Save changes:', user);
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h2>My Profile</h2>
          <div className="breadcrumbs">
            <Link to="/profile">Home</Link> &gt; My Profile
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="container">
          <div className="profile-container">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <h3>{user.firstName} {user.lastName}</h3>
                <p>{user.email}</p>
              </div>
              <ul className="profile-menu">
                <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabClick('orders')}>
                  <i className="fas fa-shopping-bag"></i> My Orders
                </li>
                <li className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => handleTabClick('wishlist')}>
                  <i className="fas fa-heart"></i> My Wishlist
                </li>
                <li className={activeTab === 'account' ? 'active' : ''} onClick={() => handleTabClick('account')}>
                  <i className="fas fa-user-cog"></i> Account Settings
                </li>
                <li className={activeTab === 'addresses' ? 'active' : ''} onClick={() => handleTabClick('addresses')}>
                  <i className="fas fa-map-marker-alt"></i> Addresses
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="profile-content">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="profile-tab" id="orders-tab">
                  <div className="tab-header">
                    <h3>My Orders</h3>
                  </div>
                  <div className="orders-container">
                    <div className="no-orders">
                      <div className="no-data-icon">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                      <h4>No Orders Yet</h4>
                      <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                      <Link to="/products" className="btn primary-btn">Shop Now</Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="profile-tab" id="wishlist-tab">
                  <div className="tab-header">
                    <h3>My Wishlist</h3>
                  </div>
                  <div className="profile-wishlist-container">
                    <div className="no-wishlist">
                      <div className="no-data-icon">
                        <i className="fas fa-heart"></i>
                      </div>
                      <h4>Your Wishlist is Empty</h4>
                      <p>Save items you like to your wishlist and they'll show up here.</p>
                      <Link to="/products" className="btn primary-btn">Start Shopping</Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="profile-tab" id="account-tab">
                  <div className="tab-header">
                    <h3>Account Settings</h3>
                  </div>
                  <form className="profile-form" onSubmit={handleFormSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="profile-first-name">First Name</label>
                        <input type="text" id="profile-first-name" value={user.firstName} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="profile-last-name">Last Name</label>
                        <input type="text" id="profile-last-name" value={user.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-email">Email Address</label>
                      <input type="email" id="profile-email" value={user.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-phone">Phone Number</label>
                      <input type="tel" id="profile-phone" value={user.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-current-password">Current Password</label>
                      <input type="password" id="profile-current-password" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="profile-new-password">New Password</label>
                        <input type="password" id="profile-new-password" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="profile-confirm-password">Confirm New Password</label>
                        <input type="password" id="profile-confirm-password" />
                      </div>
                    </div>
                    <div className="form-group checkbox-group">
                      <input type="checkbox" id="profile-newsletter" checked={user.subscribed} onChange={handleInputChange} />
                      <label htmlFor="profile-newsletter">Subscribe to newsletter</label>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn primary-btn">Save Changes</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="profile-tab" id="addresses-tab">
                  <div className="tab-header">
                    <h3>My Addresses</h3>
                    <button className="btn secondary-btn"><i className="fas fa-plus"></i> Add New Address</button>
                  </div>
                  <div className="addresses-container">
                    {addresses.map((address) => (
                      <div key={address.id} className="address-card">
                        <div className="address-header">
                          <h4>{address.label}</h4>
                          {address.isDefault && <span className="address-badge default">Default</span>}
                        </div>
                        <div className="address-content">
                          <p><strong>{address.name}</strong></p>
                          <p>{address.addressLine1}</p>
                          <p>{address.city}</p>
                          <p>{address.country}</p>
                          <p>Phone: {address.phone}</p>
                        </div>
                        <div className="address-actions">
                          {!address.isDefault && (
                            <button className="btn text-btn set-default-btn"><i className="fas fa-check"></i> Set as Default</button>
                          )}
                          <button className="btn text-btn edit-address-btn"><i className="fas fa-edit"></i> Edit</button>
                          <button className="btn text-btn delete-address-btn"><i className="fas fa-trash"></i> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
