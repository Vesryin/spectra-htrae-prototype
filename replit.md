# Overview

This is a real-time AI simulation application featuring an autonomous AI entity called "Spectra" that exists in a cyberpunk-fantasy hybrid world called "Htrae". The application provides a live dashboard where users can observe Spectra's autonomous decision-making, interactions with NPCs, and exploration of different locations. The system combines React frontend with Express backend, real-time WebSocket communication, and PostgreSQL database storage using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with cyberpunk theme including custom CSS variables and neon effects
- **State Management**: TanStack Query for server state, custom WebSocket hook for real-time updates
- **Routing**: Wouter for lightweight client-side routing
- **Layout**: Three-panel dashboard layout with left sidebar (AI status), center view (world simulation), and right sidebar (messages/events)

## Backend Architecture
- **Framework**: Express.js with TypeScript running in ES module mode
- **Real-time Communication**: WebSocket server for live updates and bidirectional communication
- **API Design**: RESTful endpoints for initial data loading, WebSocket for real-time updates
- **Service Architecture**: Singleton pattern services for Spectra AI, World simulation, and WebSocket management
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Entity-based tables for Spectra (AI entity), Locations, NPCs, World State, Messages, and Players
- **Data Types**: JSONB fields for complex data structures like mood states, memories, and relationships
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

## AI Simulation System
- **Autonomous Decision Making**: Weighted random selection based on AI mood parameters (curiosity, social, energy)
- **World Simulation**: Tick-based system that updates time, weather, NPCs, and world events
- **Memory System**: AI maintains memories of interactions and experiences stored as JSON arrays
- **Relationship Tracking**: Dynamic relationship system with trust levels and interaction history

## Real-time Features
- **WebSocket Integration**: Bidirectional communication for live AI decisions, world updates, and user interactions
- **Live Dashboard**: Real-time updates of AI status, world state, and message streams
- **Simulation Controls**: Start/stop simulation capabilities with live feedback

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **express**: Web application framework for API and static file serving
- **ws**: WebSocket library for real-time communication

## Frontend UI Dependencies
- **@radix-ui/react-**: Complete set of accessible, unstyled UI primitives
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **lucide-react**: Icon library for consistent iconography

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **drizzle-kit**: Database migration and schema management tools
- **esbuild**: Fast JavaScript bundler for production builds

## Styling and Theme
- **Google Fonts**: Orbitron and Space Mono fonts for cyberpunk aesthetic
- **Custom CSS Variables**: Extensive color system for cyberpunk theme with neon effects
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins