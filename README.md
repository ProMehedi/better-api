# Bun Hono Better Auth Full-Stack Application

A complete full-stack application with a high-performance API backend using [Bun](https://bun.sh), [Hono](https://hono.dev), and Better Auth, paired with a modern [Next.js](https://nextjs.org) frontend with [Shadcn UI](https://ui.shadcn.com/).

## Project Overview

This project consists of two main components:

- **Server**: A high-performance REST API built with Bun, Hono, and Better Auth
- **Client**: A modern Next.js 14 application with authentication UI flows

## Features

### Backend (Server)

- ⚡️ **Ultra-fast performance** with Bun runtime
- 🧩 **Modular architecture** with Hono framework
- 🔒 **Enhanced authentication** with Better-Auth
- 🔌 **MongoDB integration** with both Mongoose and native client
- 🛡️ **Role-based authorization** with admin and user roles
- 📦 **Compression support** for optimized responses
- ✅ **TypeScript** for type safety
- 🔍 **Error handling** middleware
- 🛡️ **CORS support** for cross-origin requests

### Frontend (Client)

- 🚀 **Next.js 14** with App Router for modern React
- 💅 **Shadcn UI** for beautiful, accessible components
- 🔐 **Authentication flows** including:
  - Login & Registration
  - Magic Link Authentication
  - Social Login (Apple, Google, GitHub, Facebook and more)
  - Email Verification
  - Forgot/Reset Password
  - Two-Factor Authentication
  - Profile Management
  - Change Password
  - User Management (Admin)
  - Role-Based Access Control
  - Session Management
  - Custom User Fields
- 📱 **Responsive design** for all device sizes
- 🌐 **Dashboard** with protected routes
- 👤 **User management** for admins

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Bun](https://bun.sh) (v1.0.0 or newer)
- [MongoDB](https://mongodb.com) or [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Node.js](https://nodejs.org) (v18 or newer)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/ProMehedi/bun-hono-better-auth.git
cd bun-hono-better-auth
```

2. Install server dependencies:

```bash
cd server
bun install
```

3. Install client dependencies:

```bash
cd ../client
bun install
```

### Configuration

#### Server

Create a `.env` file in the `server` directory with the following variables:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/betterAuth
API_BASE=/api/v1

# Better-Auth configuration
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

#### Client

Create a `.env.local` file in the `client` directory with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Running the Application

### Development Mode

1. Start the server:

```bash
cd server
bun dev
```

2. In another terminal, start the client:

```bash
cd client
bun dev
```

- The API will be available at: http://localhost:8000/api/v1
- The frontend will be available at: http://localhost:3000

### Production Mode

1. Build and start the server:

```bash
cd server
bun start
```

2. Build and start the client:

```bash
cd client
bun build
bun start
```

## Documentation

- **Server Documentation**: See the [server README](/server/README.md) for detailed backend information.
- **Client Documentation**: See the [client README](/client/README.md) for detailed frontend information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

Mehedi Hasan - [admin@promehedi.com](mailto:admin@promehedi.com)

Project Link: [https://github.com/ProMehedi/bun-hono-better-auth](https://github.com/ProMehedi/bun-hono-better-auth)
