# MERN Stack E-Commerce Website

## 1. Project Overview

Our E-Commerce platform, developed with the MERN stack (MongoDB, Express.js, React, and Node.js), delivers a smooth and engaging shopping experience. Customers can browse products organized by categories, leave reviews, and manage their carts with ease. Sorting and filtering options help users quickly find the right products. For secure payments, the platform integrates with Razorpay, enabling seamless transactions with multiple payment methods. A feature-rich admin panel allows efficient management of products, orders, users, and categories.

## 2. Features
- User Authentication (Signup/Login/Logout)
- Secure Payment with Razorpay
- Product Management (CRUD operations for Admins)
- Shopping Cart with add/remove/edit functionality
- Responsive Design optimized for PC and mobile
- Admin Dashboard for managing users, products, Category and orders

## 3. Tech Stack
- Frontend: React.js, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (with Mongoose ODM)
- Authentication: JWT tokens with refresh token strategy
- Payment: Razorpay Integration


## 4. Local Setup

### 1. Clone the repository

    git clone https://github.com/ChouhanAdityaRaj/E-Commerce.git
    cd E-Commerce

### 2. Install backend dependencies
    cd backend
    npm install

### 3. Install frontend dependencies
    cd frontend
    npm install

### 4. Environment Variables
   - Create a .env file in the backend folder with the following variables

     ```
     PORT = ****
     MONGODB_URI = ****
     CORS_ORIGIN = ****
     CLOUDINARY_CLOUD_NAME = ****
     CLOUDINARY_API_KEY = ****
     CLOUDINARY_API_SECRET = ****
     CLOUDINARY_FOLDER_NAME = ****
     ACCESS_TOKEN_SECRET = ****
     ACCESS_TOKEN_EXPIRY = ****
     REFRESH_TOKEN_SECRET = ****
     REFRESH_TOKEN_EXPIRY = ****
     RAZORPAY_ID_KEY = ****
     RAZORPAY_SECRET_KEY = ****
     ```

   - Create a .env file in the frontend folder with the following variables

     ```
     VITE_BACKEND_URL = ***
     VITE_RAZORPAY_ID_KEY = ***
     ```

### 5. Running Project Locally
- Start the Backend
    ```
    cd backend
    npm run dev
    ```
- Start the Frontend
    ```
    cd frontend 
    npm run dev
    ```

