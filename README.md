# Google Drive Clone

A full-stack Google Drive clone built with Next.js, Nest.js, and PostgreSQL.

## Features

- User Authentication (Sign up, Login, Logout)
- File and Folder Management
- File Upload and Download
- File Preview
- Responsive Design
- User-specific Storage
- Modern UI with ShadCN components 

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS, ShadCN UI
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks
- **File Upload**: React Dropzone
- **HTTP Client**: Axios
- **UI Components**: Radix UI primitives
- **Date Handling**: date-fns

### Backend
- **Framework**: Nest.js 10
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **File Handling**: Multer
- **Environment**: Node.js
- **Testing**: Jest

## Project Structure

```
.
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   ├── public/       # Static assets
│   └── styles/       # Global styles
│
└── backend/          # Nest.js backend application
    ├── src/          # Source code
    ├── prisma/       # Database schema and migrations
    ├── test/         # Test files
    └── uploads/      # File upload directory
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm, yarn, or pnpm

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file and add your environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your environment variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/drive_clone"
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:4000

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT 