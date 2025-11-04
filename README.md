# Entity and Workflow Management System

A comprehensive entity and workflow management application built with NestJS, React, PostgreSQL, and Clerk authentication.

## Features

- **RBAC (Role-Based Access Control)**: Manage users, groups, roles, and permissions
- **Workflow Management**: Handle approvals, patterns, exceptions, claims, and decisions
- **Real-time Updates**: WebSocket integration for live data synchronization
- **Reusable Components**: Custom Shadcn-based UI components with PrimeReact-like functionality
- **Advanced Tables**: Sortable, filterable, and searchable data tables
- **Authentication**: Clerk-based user authentication
- **Single Container Deployment**: Nginx serving frontend and proxying backend API

## Tech Stack

### Backend
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL (Database)
- TypeORM (ORM)
- Clerk (Authentication)
- Socket.IO (WebSockets)

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Shadcn UI Components
- TanStack Table (React Table)
- TanStack Query (React Query)
- Clerk React
- Socket.IO Client

### Infrastructure
- Docker
- Docker Compose
- Nginx

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Clerk account (for authentication)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd workflow
```

2. Set up environment variables:
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the files with your Clerk credentials
```

3. Update the `docker-compose.yml` with your Clerk keys or set them as environment variables:
```bash
export CLERK_SECRET_KEY="your_secret_key"
export CLERK_PUBLISHABLE_KEY="your_publishable_key"
```

4. Start the application:
```bash
docker-compose up -d
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## Local Development

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

Backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Frontend will run on http://localhost:3000

### Database

Start PostgreSQL using Docker:
```bash
docker run -d \
  --name workflow-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=workflow_db \
  -p 5432:5432 \
  postgres:16-alpine
```

## Project Structure

```
workflow/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── common/         # Shared modules (base entities, guards, decorators)
│   │   ├── config/         # Configuration files
│   │   ├── modules/
│   │   │   ├── rbac/      # RBAC entities, services, controllers
│   │   │   └── workflow/  # Workflow entities, services, controllers
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities, API client, WebSocket
│   │   ├── pages/        # Application pages
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile            # Multi-stage Dockerfile
└── README.md
```

## Key Features

### Base Entity Architecture
All entities extend a reusable `BaseEntity` class that provides:
- UUID primary keys
- Created/Updated timestamps
- Soft delete support
- Audit fields (createdBy, updatedBy)
- Active status flag
- Metadata JSONB field

### RBAC Entities
- **User**: System users with Clerk integration
- **Group**: User groups for organizational hierarchy
- **Role**: Roles with associated permissions
- **Permission**: Granular permissions (action:resource)

### Workflow Entities
- **Pattern**: Workflow patterns (sequential, parallel, conditional, escalation)
- **Approval**: Approval requests with status tracking
- **Exception**: Workflow exceptions and error handling
- **Claim**: Work item claims by users
- **Decision**: Approval decisions with audit trail

### Reusable Components
- **DataTable**: Advanced table with sorting, filtering, and searching
- **Button**: Customizable button with loading state
- **Input**: Form input with validation
- **Label**: Form label component
- Custom Shadcn components styled for consistency

### Real-time Updates
WebSocket integration provides real-time notifications for:
- Entity creation, updates, and deletions
- Approval status changes
- Decision events
- Claim updates
- Exception notifications

## API Endpoints

### RBAC
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- Similar endpoints for roles, groups, and permissions

### Workflow
- `GET /api/approvals` - List approvals
- `GET /api/approvals/my-approvals` - Get current user's approvals
- `GET /api/approvals/status/:status` - Filter by status
- `POST /api/approvals` - Create approval
- `PUT /api/approvals/:id` - Update approval
- `DELETE /api/approvals/:id` - Delete approval
- Similar endpoints for patterns, exceptions, claims, and decisions

## Environment Variables

### Backend (.env)
```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=workflow_db

CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
```

## Deployment

### Building for Production

```bash
# Build the Docker image
docker build -t workflow-app .

# Run with docker-compose
docker-compose up -d
```

### Scaling

The application can be scaled horizontally by:
1. Running multiple backend instances behind a load balancer
2. Using Redis for session management and WebSocket scaling
3. Implementing PostgreSQL read replicas for read-heavy workloads

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
