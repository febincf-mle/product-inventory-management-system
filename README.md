# Inventory Management System

A full-stack inventory management solution with a Django REST Framework backend and a React frontend.

---

## Project Structure

```

inventory-management-system/
├── backend/      # Django + DRF backend
└── frontend/     # React frontend
```

## Features

### Backend (Django + Django REST Framework)
- JWT authentication (access/refresh token system)
- Product management with:
  - Multiple **variant types** (e.g. size, color)
  - **Combinations** (e.g. Size: M, Color: Blue)
  - Product images and meta fields (price, stock, rating, etc.)
  - Adding new Products
- Category support
- Cart system with quantity tracking
- Order management with order items and timestamp
- Filtering support on:
  - Orders by date

### Frontend (React)
- Dynamic product creation form (with multiple variants and combinations)
- Auth context with login/logout via token in `localStorage`
- Cart context for adding/removing/clearing items
- Order history display
- Styled, responsive UI using modern CSS
- Notifications, and state management.

---

## Usage Instructions

### Backend Setup

1. **Create & activate virtual environment**
   ```bash
   git clone https://github.com/febincf-mle/product-inventory-management-system.git
   cd product-inventory-management-system/
   cd backend/
   python -m venv .venv
   source .venv/bin/activate 
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Apply migrations**

   ```bash
   python manage.py migrate
   ```

4. **Create superuser**

   ```bash
   python manage.py createsuperuser
   ```

5. **Run the backend server**

   ```bash
   python manage.py runserver
   ```

> Backend runs at: `http://127.0.0.1:8000/`

---

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend/
   npm install
   ```

2. **Start the React app**

   ```bash
   npm run dev
   ```

> Frontend runs at: `http://localhost:3000/`

---

## API Documentation
### Authentication
* `POST /api/v1/register/`: Route to register new users
* `POST /api/v1/login/`: Route to Login and get access tokens
* `POST /api/v1/token/refresh/`: Route to refresh the access-token

### Products
* `GET /api/v1/products/`: List all products with multiple filtering options
* `POST /api/v1/products/`: Create product with variants & combinations
* `GET /api/v1/products/<uuid:product_id>/`: Get product level information about the particular product
* `UPDATE /api/v1/products/<uuid:product_id>/`: Update a product.
* `DELETE /api/v1/products/<uuid:product_id>/`: Soft delete a product (Will not be removed from db)
* `GET /api/v1/products/<uuid:product_id>/combinations/`: List all the available product combinations of the product.
* `GET /api/v1/products/variant-combinations/<uuid:subproduct_id>/`: Get the specific sub-product.

### Stock Management
* `GET /api/v1/actions/cart/`: Get the cart of the logged in User.
* `POST /api/v1/actions/cart/add/`: Add a new CartItem to the user's cart.
* `DELETE /api/v1/actions/cart/remove/<int:cart_item_id>/`: Remove a CartItem from the cart
* `POST /api/v1/actions/orders/create/`: Creates a new Order (Purchasing the Items in the cart)
* `GET /api/v1/actions/orders/`: List the user's Orders (filterable by date using query params)

---


## Authentication

* JWT tokens stored in `localStorage` on login
* `access-token` used in all authenticated requests
* `refresh-tokens` used to get new access token
* Axios Interceptor handles using `refresh-tokens` automatically
* Backend checks user from request in DRF views

---

## Future Improvements

* Add payment integration
* Admin dashboards for analytics
* Control which Users can create Products (Role based access control)
* Sending Emails, Async Job sheduling

---

## License

MIT License. See `LICENSE` file.

---

## Author

Built by Febin CF 
