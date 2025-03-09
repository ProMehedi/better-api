# Bun-Hono-Better-Auth Frontend

A modern Next.js frontend for the Bun-Hono-Better-Auth full-stack application. This client application provides user interfaces for authentication, user management, and admin controls while connecting to the Bun + Hono API backend.

## Features

- 🚀 **Built with Next.js 14** using the App Router architecture
- 💅 **Shadcn UI** for beautiful, accessible components
- 🔐 **Complete authentication flows**:
  - Login with email and password
  - User registration
  - Forgot password / password reset
  - Email verification support
  - Magic link authentication
  - Social login (Apple, Google, GitHub, Facebook, etc.)
  - Two-factor authentication
- 🌐 **Dashboard** with protected routes
- 👤 **User profiles**:
  - Profile viewing and editing
  - Change password functionality
- 🛡️ **Admin controls** with user management
- 🔌 **Axios integration** for API communications
- 📱 **Fully responsive design** for all device sizes
- 🎨 **Modern UI/UX** with clean, intuitive interfaces

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or newer) or [Node.js](https://nodejs.org) (v18 or newer)
- Backend API server ([see server documentation](/server/README.md))

### Installation

1. Install dependencies:

```bash
cd client
bun install
# or
npm install
```

### Configuration

Create a `.env.local` file in the client directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Development

Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
client/
├── app/                     # Next.js App Router
│   ├── auth/                # Authentication pages
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── forgot-password/ # Password recovery
│   │   └── reset-password/  # Password reset
│   ├── dashboard/           # Protected dashboard area
│   │   ├── profile/         # User profile page
│   │   ├── edit-profile/    # Profile editing
│   │   ├── change-password/ # Password changing
│   │   └── users/           # Admin user management
│   └── page.tsx             # Landing page
├── components/              # Reusable components
│   └── ui/                  # Shadcn UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication helpers
│   ├── axios.ts             # API client configuration
│   ├── constants.ts         # Application constants
│   └── utils.ts             # General utilities
└── public/                  # Static assets
```

## Key Features Explained

### Authentication Flow

The authentication flow is handled through integration with the Back-end Better-Auth system:

1. Users can register through the registration form
2. Login with email and password
3. Request password reset via email
4. Access protected routes only when authenticated

### Dashboard

The dashboard area is protected and only accessible to authenticated users. It provides:

- User profile management
- Password changing functionality
- For admin users: complete user management capabilities

### Integration with API

The frontend communicates with the Bun + Hono backend API using Axios. Authentication tokens are managed and automatically included in API requests.

## Building for Production

```bash
bun run build
bun run start
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Better Auth](https://github.com/yourprofile/better-auth)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
