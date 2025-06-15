# SEO Tag Analyzer

## Overview

This is a full-stack web application that analyzes website SEO tags and provides comprehensive insights including Google and social media previews, tag details, and actionable recommendations. The application is built using a modern React frontend with TypeScript, Express.js backend, and PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with hot module replacement
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Web Scraping**: Axios for HTTP requests, Cheerio for HTML parsing
- **Validation**: Zod schemas for request/response validation

### Database Architecture
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Drizzle Kit for schema management
- **Development**: In-memory storage fallback for development

## Key Components

### Data Models
- **SEO Analyses**: Stores comprehensive SEO analysis results including meta tags, Open Graph data, and Twitter Card information
- **Analysis Results**: Computed scores and recommendations based on tag analysis
- **URL Validation**: Input validation for website URLs

### API Endpoints
- `POST /api/analyze`: Analyzes a website URL and extracts SEO tags
- Returns structured data including tag presence, content analysis, and scoring

### UI Components
- **URL Input**: Main interface for entering website URLs to analyze
- **Analysis Results**: Comprehensive dashboard showing analysis overview
- **Preview Tabs**: Multi-tab interface showing Google, Facebook, Twitter previews
- **Recommendations**: Actionable suggestions for SEO improvements

### Web Scraping Engine
- Fetches website HTML content with proper user agent headers
- Extracts title, meta description, keywords, Open Graph, and Twitter Card tags
- Handles timeout protection and error recovery
- Processes and normalizes extracted data

## Data Flow

1. **User Input**: User enters a website URL through the frontend interface
2. **Validation**: URL is validated using Zod schema on both client and server
3. **Web Scraping**: Backend fetches the website HTML content using Axios
4. **Tag Extraction**: Cheerio parses HTML and extracts SEO-relevant tags
5. **Analysis**: System analyzes extracted tags and generates scores/recommendations
6. **Storage**: Analysis results are stored in the database (or memory in development)
7. **Response**: Structured analysis data is returned to the frontend
8. **Visualization**: Frontend displays results in organized tabs and preview formats

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **axios**: HTTP client for web scraping
- **cheerio**: Server-side HTML parsing and manipulation
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **typescript**: Type checking and compilation
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Server**: Vite development server with HMR
- **Database**: In-memory storage for quick development
- **Port**: 5000 (configured in .replit)

### Production Build
- **Frontend Build**: `vite build` - outputs to `dist/public`
- **Backend Build**: `esbuild` - bundles server code to `dist/index.js`
- **Database**: PostgreSQL with Drizzle migrations
- **Deployment Target**: Autoscale deployment on Replit

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle
- **Migrations**: `npm run db:push` for schema updates
- **Connection**: Environment variable `DATABASE_URL` required

## Changelog

Changelog:
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.