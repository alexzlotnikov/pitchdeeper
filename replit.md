# replit.md

## Overview

This is a full-stack web application built with React and Express, featuring AI-powered pitch deck analysis functionality. The application allows users to upload pitch deck files and receive comprehensive analysis including feedback on content, structure, and potential investor questions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system using HSL color variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple
- **AI Integration**: Groq API for pitch deck analysis via Supabase Edge Functions

### Key Design Decisions
- **Monorepo Structure**: Shared schema and types between client and server
- **Type Safety**: Full TypeScript implementation across the stack
- **Modern Tooling**: ESNext modules, Vite for frontend, esbuild for backend bundling
- **Component-First**: Reusable UI components with consistent design system

## Key Components

### Frontend Components
- **FileUpload**: Drag-and-drop file upload with validation
- **AnalysisResults**: Comprehensive display of AI analysis results
- **UI Components**: Complete set of accessible components (buttons, cards, forms, etc.)

### Backend Components
- **Database Layer**: Drizzle ORM with PostgreSQL connection pooling
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Registration**: Modular route handling system
- **Vite Integration**: Development server with HMR support

### Shared Components
- **Schema**: Centralized database schema and validation using Drizzle and Zod
- **Type Definitions**: Shared TypeScript interfaces and types

## Data Flow

1. **File Upload**: User uploads pitch deck file through drag-and-drop interface
2. **AI Analysis**: File sent to Supabase Edge Function which processes via Groq API
3. **Results Display**: Comprehensive analysis results rendered in structured format
4. **Session Management**: User sessions stored in PostgreSQL for persistence

### Analysis Pipeline
- File validation and preprocessing
- AI-powered content analysis
- Structured feedback generation
- Investor question simulation
- Slide-by-slide optimization recommendations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **drizzle-orm**: Type-safe database queries
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### AI Integration
- **Groq API**: Large language model for pitch deck analysis
- **Supabase Edge Functions**: Serverless function execution

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Backend bundling for production
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: tsx for TypeScript execution
- Database: Drizzle migrations with push command

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Database: Automated migrations via Drizzle

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `GROQ_API_KEY`: API key for AI analysis service
- Node.js environment with ES modules support

### Replit-Specific Features
- Runtime error overlay for development
- Cartographer integration for code navigation
- Replit development banner for external access
- WebSocket configuration for Neon database