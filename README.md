# My App - API Gateway with Authentication

A full-stack application built with Zudoku (documentation/API gateway frontend) and Express (backend proxy server) featuring Clerk authentication and role-based API access.

## Overview

This application provides:
- **Frontend**: Zudoku-powered API documentation and gateway interface
- **Backend**: Express server with authenticated proxy endpoints
- **Authentication**: Clerk-based JWT authentication with role-based access control
- **API Management**: Automatic OpenAPI spec generation with environment-specific configurations

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Clerk Account** - Sign up at [clerk.com](https://clerk.com) for authentication services

## Installation

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Zudoku (API documentation framework)
- Express (backend server)
- Clerk authentication libraries
- TypeScript and development tools

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication (Required)
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_JWKS_URI=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json

# Clerk Public Key for Frontend (Required)
ZUDOKU_PUBLIC_CLERK_PUB_KEY=your_clerk_publishable_key_here

# Server Configuration (Required)
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Backend URL for Frontend (Required)
ZUDOKU_PUBLIC_BACKEND_URL=http://localhost:3001

# Domain-specific API Keys (Optional - for paid tier features)
# Replace 'yourdomain' with the domain part of user email (e.g., for user@company.com, use 'company')
yourdomain_UNSPLASH_KEY=your_unsplash_api_key_here
```

#### Getting Clerk Credentials

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. From your Clerk Dashboard:
   - **CLERK_SECRET_KEY**: Found in "API Keys" section (Secret Keys)
   - **CLERK_JWKS_URI**: Usually `https://[your-app-name].clerk.accounts.dev/.well-known/jwks.json`
   - **ZUDOKU_PUBLIC_CLERK_PUB_KEY**: Found in "API Keys" section (Publishable Keys)

#### User Roles in Clerk

Configure user roles in Clerk's Dashboard:
1. Go to "Users" → Select a user → "Metadata"
2. In "Public Metadata", add: `{"role": "basic"}` or `{"role": "paid"}`

## Running the Application

### Development Mode (Recommended)

Start both frontend and backend servers simultaneously:

```bash
npm run dev:all
```

This command will:
1. Generate the `openapi.yaml` file from the template
2. Start the Zudoku frontend on `http://localhost:3000`
3. Start the Express backend on `http://localhost:3001`

**Access Points:**
- Frontend Documentation: `http://localhost:3000`
- Backend API: `http://localhost:3001`

### Individual Server Commands

**Start only the frontend (Zudoku):**
```bash
npm run dev
```
This automatically runs the OpenAPI generation script first, then starts the frontend.

**Start only the backend (Express API server):**
```bash
npm run server
```

### Production Build

**Build the frontend for production:**
```bash
npm run build
```
This runs the OpenAPI generation script and creates an optimized production build.

**Preview the production build:**
```bash
npm run preview
```

## API Endpoints

The backend provides authenticated proxy endpoints to external APIs:

### Basic Tier APIs (All authenticated users)

- **GET** `/api/zippopotam/*` - Zip code lookup service
  - Example: `/api/zippopotam/us/90210`
  - Proxies to: `http://api.zippopotam.us`

### Paid Tier APIs (Requires 'paid' role)

- **GET** `/api/httpbin/*` - HTTP testing service
  - Example: `/api/httpbin/get`
  - Proxies to: `https://httpbin.org`

- **GET** `/api/unsplash/*` - Unsplash photo API
  - Example: `/api/unsplash/photos`
  - Proxies to: `https://api.unsplash.com`
  - **Requires**: Domain-specific API key configured in `.env`

## Authentication Flow

1. **User Login**: Users authenticate via Clerk on the frontend
2. **Token Generation**: Clerk issues a JWT session token stored in `__session` cookie
3. **API Requests**: Frontend sends requests with the session cookie
4. **Token Verification**: Backend validates JWT using Clerk's JWKS endpoint
5. **Role Check**: Backend verifies user role for paid APIs
6. **Proxy Request**: If authorized, request is proxied to the external API

## Domain-Specific API Keys

For APIs requiring user-specific keys (like Unsplash):

1. Extract domain from user's email (e.g., `user@company.com` → `company`)
2. Configure environment variable: `company_UNSPLASH_KEY=your_key`
3. Backend automatically applies the correct key based on user's email domain

## Project Structure

```
my-app/
├── server.ts                 # Express backend server
├── zudoku.config.tsx         # Zudoku frontend configuration
├── openapi.template.yaml     # OpenAPI spec template (committed)
├── openapi.yaml              # Generated OpenAPI spec (gitignored)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env                      # Environment variables (gitignored)
├── .gitignore                # Git ignore rules
├── scripts/
│   └── manage-openapi.ts     # OpenAPI generation script
├── public/                   # Static assets (logos, SVGs)
│   ├── logo-light.svg
│   ├── logo-dark.svg
│   ├── banner.svg
│   └── banner-dark.svg
├── pages/                    # Documentation pages
│   ├── introduction.mdx
│   └── example.mdx
└── plugins/                  # Custom Zudoku plugins
    └── api-badges.tsx        # API badge plugin
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend with OpenAPI generation |
| `npm run server` | Start backend API server only |
| `npm run dev:all` | Start both frontend and backend (recommended) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

## Development Workflow

1. **Initial Setup**:
   ```bash
   npm install
   # Configure .env file
   npm run dev:all
   ```

2. **Making Changes**:
   - Edit `openapi.template.yaml` to modify API specifications
   - Edit `server.ts` to add/modify API endpoints
   - Edit `zudoku.config.tsx` to customize frontend
   - Changes are hot-reloaded in development mode

3. **Adding New API Endpoints**:
   - Add route configuration in `server.ts` using `registerApiRoute()`
   - Update `openapi.template.yaml` with API documentation
   - Restart the server to apply changes

## Troubleshooting

### Port Conflicts
**Error**: `Port 3000/3001 already in use`
- Check and kill processes using these ports:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -i :3000
  kill -9 <PID>
  ```
- Or change ports in `.env` (update PORT and FRONTEND_URL)

### Authentication Issues
**Error**: `Unauthorized` or `Invalid token`
- Verify Clerk credentials in `.env` are correct
- Ensure CLERK_JWKS_URI matches your Clerk application
- Check that user has proper role set in Clerk metadata
- Clear browser cookies and re-authenticate

### API Key Errors
**Error**: `API key not configured for your domain`
- Verify domain-specific API key format: `{domain}_UNSPLASH_KEY`
- Extract domain correctly from email (before @, and before first dot)
- Example: `user@company.com` → use `company_UNSPLASH_KEY`

### CORS Errors
**Error**: `CORS policy blocked`
- Ensure `FRONTEND_URL` in `.env` matches actual frontend URL
- Check that backend is running on the configured PORT
- Verify `ZUDOKU_PUBLIC_BACKEND_URL` is correctly set

### OpenAPI Generation Fails
**Error**: Issues with openapi.yaml
- Ensure `openapi.template.yaml` exists and is valid YAML
- Check that `ZUDOKU_PUBLIC_BACKEND_URL` is set in `.env`
- Manually run: `npx tsx scripts/manage-openapi.ts`

### Module Not Found Errors
**Error**: Cannot find module
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18 or higher: `node --version`

## Security Notes

- Never commit `.env` file to version control
- Keep Clerk secret keys confidential
- Use HTTPS in production (enforced automatically when `NODE_ENV=production`)
- Regularly rotate API keys and tokens
- Review
