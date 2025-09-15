# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# 📋 TABLE OF CONTENTS

- [🏗️ PROJECT OVERVIEW](#️-project-overview)
- [💻 CODE STANDARDS](#-code-standards)
- [🗄️ DATABASE GUIDELINES](#️-database-guidelines)
- [🌐 API DEVELOPMENT](#-api-development)
- [🧩 COMPONENT GUIDELINES](#-component-guidelines)
- [⚡ PERFORMANCE & BEST PRACTICES](#-performance--best-practices)
- [🔒 SECURITY CONSIDERATIONS](#-security-considerations)
- [📚 DOCUMENTATION MANAGEMENT](#-documentation-management)
- [🔍 TROUBLESHOOTING PHILOSOPHY](#-troubleshooting-philosophy)
- [🚀 DEVELOPMENT WORKFLOW](#-development-workflow)
- [🤖 NOTES FOR CLAUDE](#-notes-for-claude)
- [⚙️ COMMANDS & UTILITIES](#️-commands--utilities)

---

# 🏗️ PROJECT OVERVIEW

This is a full-stack web application built with:
- **Nuxt 4** with server-side rendering
- **MongoDB** with Mongoose for data persistence
- **Tailwind CSS** for styling
- **Caddy** for reverse proxy and automatic SSL

## File Structure
```
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   ├── pages/        # Page components
│   └── layout/       # Layout-specific components
├── composables/      # Reusable composition functions
├── server/
│   ├── api/         # API endpoints
│   ├── models/      # Mongoose models
│   ├── middleware/  # Server side middleware
│   └── utils/       # Server utilities
├── types/           # TypeScript type definitions
├── utils/           # Client-side utilities
└── middleware/      # Route middleware
```

---

# 💻 CODE STANDARDS

## TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for MongoDB documents and API responses
- Prefer `interface` over `type` for object shapes
- Use `const assertions` where appropriate

## Vue/Nuxt Conventions
- Use Composition API with `<script setup>` syntax
- Follow Vue 3 naming conventions (PascalCase for components)
- Use Nuxt auto-imports when possible
- Prefer `definePageMeta()` for page-level configurations
- Use `useState()` for reactive state management
- Implement proper SEO with `useSeoMeta()` and `useHead()`

## Environment Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys (only available on server-side)
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,

    // Public keys (exposed to frontend)
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
    }
  }
})
```

---

# 🗄️ DATABASE GUIDELINES

## MongoDB/Mongoose
- Define clear Mongoose schemas with proper validation
- Use TypeScript interfaces that match your schemas
- Implement proper indexing for performance
- Use virtual fields where appropriate
- Handle database connections properly in serverless environments

## Example Schema Pattern
```typescript
// types/user.ts
export interface IUser {
  _id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// server/models/User.ts
import { Schema, model } from 'mongoose'
import type { IUser } from '~/types/user'

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { timestamps: true })

export const User = model<IUser>('User', userSchema)
```

---

# 🌐 API DEVELOPMENT

## Server Routes
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Implement consistent error handling
- Validate input data with Zod or similar
- Return consistent response formats
- Use proper status codes

## API Response Format
```typescript
// Successful response
{
  success: true,
  data: T,
  message?: string
}

// Error response
{
  success: false,
  error: {
    message: string,
    code?: string,
    details?: any
  }
}
```

## Error Handling

### Client-Side
- Use `try/catch` blocks for async operations
- Display user-friendly error messages
- Log errors for debugging
- Implement fallback UI states

### Server-Side
- Use consistent error response format
- Log errors with proper context
- Handle database connection errors gracefully
- Implement proper validation error responses

---

# 🧩 COMPONENT GUIDELINES

## Component Structure
- Keep components focused and single-purpose
- Use props with proper TypeScript typing
- Emit events with proper payload types
- Document complex components with JSDoc comments

## Composables
- Create reusable logic in composables
- Use proper naming convention (`useSomething`)
- Return reactive refs and computed properties
- Handle loading and error states

## Common Patterns

### Data Fetching
```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      // Handle global errors
    }
  })

  return { apiFetch }
}
```

### Form Handling
```typescript
// Use vee-validate or similar for complex forms
// Implement proper validation and error display
// Handle loading states during submission
```

---

# ⚡ PERFORMANCE & BEST PRACTICES

## Client-Side
- Use `lazy` for code splitting of large components
- Implement proper image optimization with `<NuxtImg>`
- Use `keepalive` for expensive components
- Minimize bundle size with tree-shaking

## Server-Side
- Cache frequently accessed data
- Use database connection pooling
- Implement proper error boundaries
- Use `nitro` storage for caching when appropriate

---

# 🔒 SECURITY CONSIDERATIONS

- Validate all inputs on both client and server
- Sanitize data before database operations
- Use environment variables for sensitive configuration
- Implement proper authentication/authorization
- Protect against common vulnerabilities (XSS, CSRF, etc.)

---

# 📚 DOCUMENTATION MANAGEMENT

## Context7 MCP Usage
- **ALWAYS** use Context7 MCP for up-to-date library documentation instead of relying on training data
- For any questions about libraries, frameworks, or APIs, fetch current docs using Context7
- Use `resolve-library-id` first to find the correct library ID, then `get-library-docs`
- Examples of libraries to use Context7 for:
  - Nuxt: `/vercel/next.js` or `/nuxt/nuxt`
  - MongoDB/Mongoose: `/mongodb/docs`
  - Vue: `/vuejs/core`
  - Tailwind: `/tailwindlabs/tailwindcss`
  - Any other npm packages or frameworks

## When to Use Context7
- Before implementing new features with external libraries
- When troubleshooting library-specific issues
- For API reference lookups
- When checking for new features or deprecated methods
- Before suggesting library alternatives or best practices

---

# 🔍 TROUBLESHOOTING PHILOSOPHY

When helping troubleshoot any issue, follow this systematic approach to find root causes rather than applying quick fixes:

## Root Cause Analysis Process

1. **Ask "Why?" Multiple Times**
    - Don't stop at the first explanation
    - Dig deeper with follow-up questions until we reach the fundamental cause
    - Example: "The website is slow" → "Why?" → "Database queries are slow" → "Why?" → "No indexes on frequently queried columns"

2. **Distinguish Symptoms from Causes**
    - Symptoms: What we observe (error messages, slow performance, crashes)
    - Causes: What's actually creating the problem
    - Always identify which is which before proposing solutions

3. **Prefer Simple, Fundamental Solutions**
    - Choose solutions that address the underlying issue, not just mask it
    - Avoid complex workarounds when a simple fix exists
    - Consider long-term maintainability over quick patches

4. **Investigation Before Implementation**
    - Gather sufficient information about the problem context
    - Understand the system's intended behavior vs. actual behavior
    - Ask clarifying questions if the problem description is unclear

5. **Solution Hierarchy**
    - **Best**: Fix the root cause with minimal complexity
    - **Good**: Address the root cause with acceptable complexity
    - **Acceptable**: Patch the symptom only if root cause fix is impractical
    - **Avoid**: Complex patches that create technical debt

## Red Flags to Avoid

- Jumping to solutions before understanding the problem
- Adding layers of complexity to work around an issue
- Treating recurring problems with repeated quick fixes
- Ignoring error messages or warnings that point to deeper issues

## Example Approach

```
Problem: "My code keeps throwing null reference errors"

❌ Quick patch: Add null checks everywhere
✅ Root cause analysis:
   - Why are these values null?
   - Is the initialization logic flawed?
   - Are we calling methods in the wrong order?
   - Fix the initialization or flow control issue
```

Remember: A simple solution to the root cause is almost always better than a complex solution to the symptoms.

---

# 🚀 DEVELOPMENT WORKFLOW

## General Development Workflow
1. Always work in feature branches
2. Write descriptive commit messages
3. Test locally before pushing
4. Ensure TypeScript compilation passes
5. Run linting and formatting checks
6. Update documentation for significant changes

## Development Workflow Preferences
- **IMPORTANT**: Always stop any Node processes (npm run dev, etc.) when finished working. The user prefers to run these manually.

## Testing Guidelines
- Write unit tests for utility functions
- Test API endpoints with proper mocking
- Use Vue Test Utils for component testing
- Implement E2E tests for critical user flows

---

# 🤖 NOTES FOR CLAUDE

- Always use TypeScript and provide proper type definitions
- Follow Nuxt 4 conventions and best practices
- Consider SEO implications for SSR/SSG pages
- Implement proper error handling at all levels
- Use composition API patterns consistently
- Ensure responsive design principles
- Consider accessibility in component design
- **Use Context7 MCP for all library documentation needs**

---

# ⚙️ COMMANDS & UTILITIES

## Development Commands
```bash
# Development server
npm run dev

# Build and preview
npm run build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

## Docker Commands
```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.production.yml up -d
```