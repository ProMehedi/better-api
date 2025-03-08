# Bun + Hono + Better Auth

A modern, high-performance API using [Bun](https://bun.sh), [Hono](https://hono.dev), [Better Auth](https://github.com/yourprofile/better-auth), and [MongoDB](https://mongodb.com) with TypeScript.

## Features

- ⚡️ **Ultra-fast performance** with Bun runtime
- 🔄 **Hot reloading** for fast development cycles
- 🧩 **Modular architecture** for scalability
- 🔒 **Enhanced authentication** with Better-Auth
  - Email/password authentication
  - Session management
  - Password reset flows
  - Email verification
  - Custom user fields
- 🔌 **MongoDB integration** using both Mongoose and native MongoDB client
- 🛡️ **Role-based authorization** with admin and user roles
- 📦 **Compression support** for optimized responses
- ✅ **TypeScript** for type safety
- 🔍 **Error handling** middleware
- 🛡️ **CORS support** for secure cross-origin requests

## Why Bun + Hono + Better Auth?

### Bun

- **Performance**: Bun is designed for speed, offering faster startup times and lower latency compared to traditional JavaScript runtimes.
- **Modern Tooling**: Bun includes a modern package manager, bundler, and test runner, making it a comprehensive tool for modern JavaScript development.
- **Native Support**: Bun provides native support for TypeScript, JSX, and more, reducing the need for additional tooling.

### Hono

- **Lightweight**: Hono is a lightweight web framework that provides a minimalistic approach to building APIs, reducing overhead and improving performance.
- **Middleware Support**: Hono offers a robust middleware system, allowing for easy integration of features like logging, authentication, and error handling.
- **Flexibility**: Hono's modular architecture allows developers to pick and choose the components they need, making it highly customizable.

### Better Auth

- **Comprehensive Authentication**: Better Auth provides a complete authentication solution, including email/password authentication, session management, and password reset flows.
- **Customizable**: Better Auth allows for extensive customization, including custom user fields, email verification, and role-based access control.
- **Integration**: Better Auth seamlessly integrates with MongoDB and other databases, making it easy to add authentication to any project.

Combining these three technologies provides a powerful, high-performance, and flexible foundation for building modern APIs. Whether you're building a small project or a large-scale application, Bun, Hono, and Better Auth offer the tools and features you need to succeed.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [Better-Auth Integration](#better-auth-integration)
  - [Authentication Flow](#authentication-flow)
  - [Configuration Options](#configuration-options)
  - [User Management](#user-management)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Bun](https://bun.sh) (v1.0.0 or newer)
- [MongoDB](https://mongodb.com) or [MongoDB Atlas](https://www.mongodb.com/atlas/database)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/bun-hono-better-auth.git
cd bun-hono-better-auth
```

2. Install dependencies:

```bash
bun install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/betterAuth
API_BASE=/api/v1

# Better-Auth configuration
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

## Usage

### Development

Run the development server with hot reloading:

```bash
bun dev
```

### Production

Build and start the production server:

```bash
bun start
```

## Better-Auth Integration

This project showcases a seamless integration of Better-Auth with a Hono API framework, using MongoDB as the database backend.

### Authentication Flow

1. **Registration**: Users can register through the `/api/auth/signup` endpoint
2. **Login**: Authentication occurs via `/api/auth/signin`
3. **Session Management**: All authenticated requests use Better-Auth session tokens
4. **Password Reset**: Integrated password reset functionality
5. **Email Verification**: Optional email verification flow

### Configuration Options

The project demonstrates an advanced Better-Auth configuration with:

```typescript
// Better-Auth configuration with MongoDB adapter
export const auth = betterAuth({
  database: mongodbAdapter(mongodb),
  user: {
    // Custom user fields including phone and isAdmin flag
    additionalFields: {
      phone: { type: 'string', nullable: true, returned: true },
      isAdmin: { type: 'boolean', default: false, returned: true },
    },
    // Email change functionality
    changeEmail: {
      enabled: true,
      // Email verification flow for email changes
    },
  },
  // Email and password authentication configuration
  emailAndPassword: {
    enabled: true,
    // Secure password hashing with Bun's built-in utilities
    password: {
      hash: async (password) => {
        return await Bun.password.hash(password, {
          algorithm: 'bcrypt',
          cost: 10,
        })
      },
      verify: async ({ password, hash }) => {
        return await Bun.password.verify(password, hash)
      },
    },
    // Email verification configuration
    requireEmailVerification: false,
    // Password reset functionality
  },
})
```

### User Management

Better-Auth handles core authentication while custom routes extend user management:

- User profile retrieval with auth session data
- Admin-only routes for accessing user data
- Profile editing with authorization checks
- Role-based access control with isAdmin flag

## API Routes

| Method | Route                   | Description         | Auth Required | Provider    |
| ------ | ----------------------- | ------------------- | ------------- | ----------- |
| POST   | `/api/auth/signup`      | User registration   | No            | Better-Auth |
| POST   | `/api/auth/signin`      | User login          | No            | Better-Auth |
| POST   | `/api/auth/signout`     | User logout         | Yes           | Better-Auth |
| POST   | `/api/auth/reset`       | Password reset      | No            | Better-Auth |
| GET    | `/api/v1/users`         | Get all users       | Yes (Admin)   | Custom      |
| GET    | `/api/v1/users/profile` | Get user profile    | Yes           | Custom      |
| PUT    | `/api/v1/users/profile` | Update user profile | Yes           | Custom      |
| GET    | `/api/v1/users/:id`     | Get user by ID      | Yes           | Custom      |

### Protected Routes

Protected routes require authentication. Include your authentication token according to Better-Auth specifications.

## Project Structure

```
├── src/
│   ├── config/              # Configuration files
│   │   ├── auth.config.ts   # Better-Auth configuration
│   │   ├── compress.config.ts  # Compression configuration
│   │   ├── db.config.ts     # Database configuration
│   │   └── index.ts         # Config exports
│   ├── controllers/         # Route controllers
│   │   ├── user.controllers.ts # User-related controllers
│   │   └── index.ts         # Controller exports
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middlewares.ts # Authentication middleware
│   │   ├── error.middlewares.ts # Error handling middleware
│   │   └── index.ts         # Middleware exports
│   ├── routes/              # API routes
│   │   ├── user.routes.ts   # User routes
│   │   └── index.ts         # Route exports
│   └── server.ts            # Main application entry
├── .env                     # Environment variables (create this)
├── bun.lock                 # Bun lock file
├── package.json             # Package configuration
├── README.md                # This file
└── tsconfig.json            # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Mehedi Hasan - [admin@promehedi.com](mailto:admin@promehedi.com)

Project Link: [https://github.com/ProMehedi/bun-hono-better-auth](https://github.com/ProMehedi/bun-hono-better-auth)
