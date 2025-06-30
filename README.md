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

---

## Usage Instructions

### Backend Setup

1. **Create & activate virtual environment**
   ```bash
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
   npm start
   ```

> Frontend runs at: `http://localhost:3000/`

---

## API Documentation

* `GET /api/v1/products/`: List all products with multiple filtering options
* `POST /api/v1/products/`: Create product with variants & combinations
* `POST /api/v1/products/`: Create product with variants & combinations
* `POST /api/cart/add/`: Add a specific product to cart
* `GET /api/orders/`: Get user orders
* `GET /api/orders/?date=2025-06-30`: Filter orders by specific date

---


## Authentication

* JWT tokens stored in `localStorage` on login
* `access-token` used in all authenticated requests
* Backend checks user from request in DRF views

---

## Future Improvements

* Add payment integration
* Admin dashboards for analytics

---

## License

MIT License. See `LICENSE` file.

---

## Author

Built by Febin CF 