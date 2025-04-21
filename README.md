# Bun + Hono + Better API

A modern, high-performance API using [Bun](https://bun.sh), [Hono](https://hono.dev), [Better Auth](https://better-auth.com), and [PostgreSQL](https://www.postgresql.org/) with TypeScript.

## Features

- ⚡️ **Ultra-fast performance** with Bun runtime
- 🔄 **Hot reloading** for fast development cycles
- 🧩 **Modular architecture** for scalability
- 🔒 **Enhanced authentication** with Better-Auth
  - Email/password authentication
  - Magic Link authentication
  - Social logins (e.g., GitHub)
  - Session management
  - Password reset flows
  - Email verification & change flows
  - Account linking
  - Custom user fields
- 🐘 **PostgreSQL integration** using `pg` client pool
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

- **Comprehensive Authentication**: Better Auth provides a complete authentication solution, including email/password, magic links, social logins, session management, and password reset flows.
- **Customizable**: Better Auth allows for extensive customization, including custom user fields, email verification, and role-based access control.
- **Integration**: Better Auth seamlessly integrates with PostgreSQL and other databases, making it easy to add authentication to any project.

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
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/better-api.git
cd better-api
```

2. Install dependencies:

```bash
bun install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```dotenv
# Server Configuration
PORT=8000
API_BASE=/api/v1
APP_URL=http://localhost:3000 # Your frontend URL

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Better-Auth Configuration
BETTER_AUTH_SECRET=your_very_secure_secret_key_32_chars_long # Use a strong, random 32-character secret
BETTER_AUTH_URL=http://localhost:8000 # Your backend API URL where Better Auth runs

# Social Login Providers (Example: GitHub)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Configuration (if using email features like verification, reset, magic links)
# Add your email provider (e.g., Resend, SMTP) credentials here
# Example for SMTP:
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=your_email_user
# SMTP_PASS=your_email_password
# EMAIL_FROM=noreply@example.com
```

## Updated Database Integration

This project now uses **Drizzle ORM** instead of the `pg` client pool for PostgreSQL integration. Drizzle ORM provides a modern, type-safe, and flexible way to interact with your database.

### Updated Environment Variables

Ensure your `.env` file is updated with the necessary configuration for Drizzle ORM. Refer to the example below:

```dotenv
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
```

### Database Migrations

Drizzle ORM uses a streamlined approach for managing database schema. Follow these steps to generate and apply migrations:

1. **Generate Better Auth Schema:**
   ```bash
   bunx @better-auth/cli@latest generate --config config/auth.config.ts --output config/schema/auth-schema.ts
   ```

2. **Generate Drizzle Migrations:**
   ```bash
   bunx drizzle-kit generate
   ```

3. **Apply Migrations:**
   ```bash
   bunx drizzle-kit push
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

This project showcases a seamless integration of Better-Auth with a Hono API framework, using PostgreSQL as the database backend.

### Authentication Flow

1.  **Registration**: Users can register through the `/api/auth/signup` endpoint.
2.  **Login**: Authentication occurs via `/api/auth/signin` (email/password), `/api/auth/magic-link` (magic link), or social providers (e.g., `/api/auth/github`).
3.  **Session Management**: All authenticated requests use Better-Auth session tokens.
4.  **Password Reset**: Integrated password reset functionality via `/api/auth/reset-password`.
5.  **Email Verification**: Optional email verification flow.
6.  **Account Linking**: Link multiple authentication methods (e.g., email/password + GitHub) to a single user account.

### Configuration Options

The project demonstrates an advanced Better-Auth configuration (`config/auth.config.ts`) with:

- PostgreSQL database adapter (`pg` pool)
- Custom user fields (`phone`, `isAdmin`)
- Email change functionality with verification
- Account linking
- Email/Password authentication with secure hashing (Bun.password)
- Email verification (optional)
- Password reset
- Magic Link plugin
- Social Providers (GitHub example)

```typescript
// Example snippet from config/auth.config.ts
export const auth = betterAuth({
  database: DB, // PostgreSQL Pool instance
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: [APP_URL],
  user: {
    modelName: 'users',
    additionalFields: {
      phone: { type: 'string', nullable: true, returned: true },
      isAdmin: { type: 'boolean', default: false, returned: true },
    },
    changeEmail: {
      enabled: true,
      // ... send email logic
    },
  },
  session: { modelName: 'sessions' },
  account: {
    modelName: 'accounts',
    accountLinking: {
      enabled: true,
      // ... configuration
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        /* ... Bun.password.hash */
      },
      verify: async ({ password, hash }) => {
        /* ... Bun.password.verify */
      },
    },
    requireEmailVerification: false,
    // ... email verification and password reset config
  },
  plugins: [
    magicLink({
      // ... send email logic
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    // Add other providers like Google, etc.
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

| Method | Route                             | Description                           | Auth Required | Provider    |
| ------ | --------------------------------- | ------------------------------------- | ------------- | ----------- |
| POST   | `/api/auth/signup`                | User registration                     | No            | Better-Auth |
| POST   | `/api/auth/signin`                | User login (email/pass)               | No            | Better-Auth |
| POST   | `/api/auth/magic-link`            | Request Magic Link                    | No            | Better-Auth |
| GET    | `/api/auth/magic-link/verify`     | Verify Magic Link Token               | No            | Better-Auth |
| GET    | `/api/auth/github`                | Initiate GitHub Login                 | No            | Better-Auth |
| GET    | `/api/auth/github/callback`       | GitHub Login Callback                 | No            | Better-Auth |
| POST   | `/api/auth/signout`               | User logout                           | Yes           | Better-Auth |
| POST   | `/api/auth/reset-password`        | Request Password Reset                | No            | Better-Auth |
| POST   | `/api/auth/reset-password/verify` | Verify Reset Token & Set New Password | No            | Better-Auth |
| GET    | `/api/v1/users`                   | Get all users                         | Yes (Admin)   | Custom      |
| GET    | `/api/v1/users/profile`           | Get user profile                      | Yes           | Custom      |
| PUT    | `/api/v1/users/profile`           | Update user profile                   | Yes           | Custom      |
| GET    | `/api/v1/users/:id`               | Get user by ID                        | Yes           | Custom      |

_Note: Auth routes may vary based on enabled Better Auth features._

### Protected Routes

Protected routes require authentication. Include your authentication token according to Better-Auth specifications.

## Project Structure

```
.
├── better-auth_migrations/ # Better Auth database migrations
├── config/                 # Configuration files
│   ├── auth.config.ts      # Better-Auth configuration
│   ├── compress.config.ts  # Compression configuration
│   ├── db.config.ts        # Database (PostgreSQL) configuration
│   └── index.ts            # Config exports
├── controllers/            # Route controllers
│   ├── user.controllers.ts # User-related controllers
│   └── index.ts            # Controller exports
├── libs/                   # Shared libraries/utilities
│   ├── constants.ts        # Environment constants
│   ├── index.ts            # Lib exports
│   └── mail.ts             # Email sending utility
├── middlewares/            # Hono middlewares
│   ├── auth.middlewares.ts # Authentication/Authorization middleware
│   ├── error.middlewares.ts# Error handling middleware
│   └── index.ts            # Middleware exports
├── routes/                 # API routes
│   ├── user.routes.ts      # User routes (/api/v1/users)
│   └── index.ts            # Route exports
├── .env                    # Environment variables (create this)
├── .gitignore              # Git ignore file
├── bun.lockb               # Bun lock file
├── package.json            # Project dependencies and scripts
├── README.md               # This file
├── server.ts               # Main application entry point (Hono server)
└── tsconfig.json           # TypeScript configuration
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

Project Link: [https://github.com/ProMehedi/better-api](https://github.com/ProMehedi/better-api)
