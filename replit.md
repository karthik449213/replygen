# ReplyGen - AI Email Reply Generator

## Overview

ReplyGen is a modern web application that generates professional email replies using AI. The application features a clean, responsive interface built with React and TypeScript, powered by a Node.js/Express backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Request Handling**: JSON-based request/response with validation using Zod
- **Development**: Hot reload with tsx for TypeScript execution

### Database & ORM
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver for PostgreSQL

## Key Components

### AI Integration
- **Provider**: OpenRouter API for AI-powered email reply generation
- **Models**: Configurable AI models through OpenRouter
- **Tone Options**: 7 different tone presets (professional, friendly, apologetic, enthusiastic, concise, detailed, diplomatic)
- **Response Processing**: Structured response with generated reply and statistics

### User Interface
- **Design System**: Custom color palette with CSS variables
- **Typography**: Inter font family for modern appearance
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Library**: Comprehensive UI components (buttons, forms, dialogs, etc.)
- **Accessibility**: ARIA-compliant components with keyboard navigation

### Form Handling
- **Validation**: Client-side validation with Zod schemas
- **User Experience**: Real-time feedback and loading states
- **Input Management**: Controlled components with React Hook Form integration
- **Error Handling**: Graceful error states with user-friendly messages

## Data Flow

1. **User Input**: User pastes email content and selects desired tone
2. **Validation**: Frontend validates input using Zod schemas
3. **API Request**: Validated data sent to `/api/generate-reply` endpoint
4. **AI Processing**: Backend forwards request to OpenRouter API with structured prompt
5. **Response Generation**: AI generates contextual reply based on input and tone
6. **Statistics Calculation**: Backend calculates word count, character count, and generation time
7. **Client Update**: Frontend receives generated reply and updates UI with results
8. **User Actions**: User can copy reply, regenerate, or start over

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles Node.js application to `dist/index.js`
- **Assets**: Static assets served from build directory

### Environment Configuration
- **Development**: Uses tsx for hot reload and Vite dev server
- **Production**: Serves built static files with Express
- **Database**: Requires DATABASE_URL environment variable
- **AI Service**: Requires OPENROUTER_API_KEY environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon recommended)
- OpenRouter API access
- Environment variable support

## Changelog

- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.