<div align="center">

<!-- HEADER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a00,40:3d1a00,80:7a3300,100:c45c00&height=220&section=header&text=🍽️%20Noman%20Restaurant&fontSize=54&fontColor=ffffff&fontAlignY=45&desc=Full%20Stack%20Restaurant%20Management%20%26%20Ordering%20System&descAlignY=68&descSize=16&descFontColor=ffb347&animation=fadeIn" />

<br/>

<!-- BADGES -->
<img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232a" />
&nbsp;
<img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=1a1a1a" />
&nbsp;
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white&labelColor=1a1a1a" />
&nbsp;
<img src="https://img.shields.io/badge/Status-Active-c45c00?style=for-the-badge&labelColor=1a0a00" />

<br/><br/>

> *A modern, full-stack restaurant web application offering seamless menu browsing, cart management, and order placement — built with React on the frontend and Node.js + Express on the backend.*

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Noman Restaurant** is a full-stack web application that delivers a rich digital dining experience. Customers can explore the menu, filter by category, add items to their cart, and place orders — all from a clean and responsive interface. The backend provides a robust REST API powering every interaction, from fetching menu items to managing order records.

---

## ✨ Features

### 👤 Customer Side
- 🍕 **Browse Menu** — View all dishes with images, descriptions, and prices
- 🔍 **Category Filtering** — Filter by Starters, Mains, Desserts, Drinks, etc.
- 🛒 **Cart Management** — Add, remove, and update item quantities in real time
- 📦 **Order Placement** — Submit orders with delivery details
- 📱 **Responsive Design** — Fully optimized for mobile, tablet, and desktop

### 🔧 Admin / Backend
- 📋 **Menu Management** — Add, update, and delete menu items via API
- 📊 **Order Tracking** — View and update order statuses (Pending → Preparing → Delivered)
- 🔐 **Secure Endpoints** — Protected routes with authentication middleware

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router, Context API / Redux |
| **Styling** | Tailwind CSS / CSS Modules |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / MySQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **API Client** | Axios |
| **Dev Tools** | Nodemon, dotenv, ESLint, Prettier |

---

## 📁 Project Structure

```
noman-restaurant/
│
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/              # Images, icons, fonts
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── MenuCard/
│   │   │   ├── Cart/
│   │   │   └── Footer/
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── OrderConfirmation.jsx
│   │   ├── context/             # Global state (Cart, Auth)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # Database connection
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── authRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) or MySQL (depending on your DB choice)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/noman-restaurant.git
cd noman-restaurant
```

---

### 2. Setup the Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# → Fill in your values (see Environment Variables below)

# Start the development server
npm run dev
```

The backend will run on **http://localhost:5000**

---

### 3. Setup the Frontend

```bash
# Open a new terminal and navigate to client
cd client

# Install dependencies
npm install

# Start the React development server
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory with the following:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/noman-restaurant
# or for MySQL:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=noman_restaurant

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

---

### 🍽️ Menu Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/menu` | Get all menu items | ❌ |
| `GET` | `/menu/:id` | Get single menu item | ❌ |
| `GET` | `/menu/category/:name` | Filter by category | ❌ |
| `POST` | `/menu` | Add new menu item | ✅ Admin |
| `PUT` | `/menu/:id` | Update menu item | ✅ Admin |
| `DELETE` | `/menu/:id` | Delete menu item | ✅ Admin |

**Sample Response — `GET /api/menu`**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "64abc123",
      "name": "Chicken Karahi",
      "description": "Tender chicken cooked in a rich, spiced tomato gravy.",
      "price": 850,
      "category": "Mains",
      "image": "/uploads/chicken-karahi.jpg",
      "available": true
    }
  ]
}
```

---

### 📦 Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/orders` | Place a new order | ❌ |
| `GET` | `/orders` | Get all orders | ✅ Admin |
| `GET` | `/orders/:id` | Get order by ID | ✅ |
| `PUT` | `/orders/:id/status` | Update order status | ✅ Admin |

**Sample Request — `POST /api/orders`**
```json
{
  "customerName": "Ahmed Khan",
  "phone": "03001234567",
  "address": "House 12, Block A, Islamabad",
  "items": [
    { "menuItem": "64abc123", "quantity": 2 },
    { "menuItem": "64abc456", "quantity": 1 }
  ]
}
```

---

### 🔐 Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/auth/me` | Get current user profile |

---

## 📸 Screenshots

> *Add your screenshots here after deployment.*

| Home Page | Menu Page |
|-----------|-----------|
| ![Home](./docs/screenshots/home.png) | ![Menu](./docs/screenshots/menu.png) |

| Cart | Order Confirmation |
|------|--------------------|
| ![Cart](./docs/screenshots/cart.png) | ![Order](./docs/screenshots/order.png) |

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/your-feature-name`
3. **Commit** your changes — `git commit -m "feat: add your feature"`
4. **Push** to your branch — `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow the existing code style and include meaningful commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">


<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a00,40:3d1a00,80:7a3300,100:c45c00&height=120&section=footer&animation=fadeIn&reversal=true" />

</div>
