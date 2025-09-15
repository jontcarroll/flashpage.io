# Development Workflow Guidelines

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