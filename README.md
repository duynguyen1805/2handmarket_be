# Old Stuff Marketplace - Backend API

Welcome to the Old Stuff Marketplace Backend API project! This project is a backend application built with Node.js and Express.js. It serves as the backend for the Old Stuff Marketplace frontend application, providing various APIs for user authentication, ad posting, and administrative functions. Below is a comprehensive guide to help you get started and understand the project structure, features, and setup instructions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
<!-- - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Ad Management](#ad-management)
  - [Admin Functions](#admin-functions) -->
- [Middleware](#middleware)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration and Login:** API endpoints for user registration and login.
- **JWT Authentication:** Secure authentication using JWT tokens.
- **Role-based Access Control:** API access control based on user roles.
- **Search Functionality:** APIs for searching ads.
- **User Profile Management:** APIs for updating user information.
- **Ad Posting and Management:** APIs for posting new ads and editing existing ones.
- **Data Retrieval for Frontend:** APIs for fetching ad data for frontend display.
- **Admin Moderation:** APIs for ad approval, rejection, and deletion.
- **User Account Management:** APIs for managing user accounts.

## Tech Stack

- **Node.js:** JavaScript runtime for building the backend.
- **Express.js:** Web framework for Node.js.
- **JWT:** JSON Web Token for secure authentication.
- **MongoDB:** MongoDB database

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- MongoDB (for database)

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/old-stuff-marketplace-backend.git
   cd old-stuff-marketplace-backend
   ```

2. **Install dependencies**

   ```
   npm install
   #or
   yarn install
   ```

3. **Environment Variables**

   Create a .env file in the root directory and configure the following environment variables:

   ```
   PORT=3000
   URL_FONTEND=your_frontend_url
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string

   ```

### Running the Application

    To start the development server:

    ```
    npm start
    # or
    yarn start

    ```

### Project Structure

```
2handmarket_be/
├── config/db           # Config database mongodb connection
├── controllers/        # Route handlers
├── middlewares/        # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Utility functions
├── .env                # Environment variables
├── app.js              # Express app setup
├── server.js           # Entry point of the application
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation

```

### Middleware

- **Authentication Middleware:** Verify JWT tokens and protect routes.
- **Authorization Middleware:** Check user roles and permissions for accessing specific endpoints.

### Configuration

Configure the application using environment variables defined in the .env file. Adjust the MongoDB connection string and JWT secret as needed.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any feature additions, bug fixes, or improvements.
