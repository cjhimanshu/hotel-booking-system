# Code Style Guide

## JavaScript/Node.js

### Naming Conventions

- **Variables**: camelCase (`const userName = 'John'`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_RETRY = 3`)
- **Classes/Constructors**: PascalCase (`class UserController {}`)
- **Files**: kebab-case for utilities, camelCase for classes (`user-validator.js`, `UserModel.js`)

### Code Formatting

- Use 2 spaces for indentation
- Semicolons required at end of statements
- No trailing commas in function arguments
- Max line length: 100 characters

### Function Guidelines

- Keep functions focused and small
- Use descriptive names that indicate purpose
- Add JSDoc comments for complex functions
- Use arrow functions for callbacks

### Error Handling

- Always use try-catch for async operations
- Include error context in messages
- Log errors with appropriate severity
- Return meaningful error responses

## React

### Component Structure

- Use functional components with hooks
- Keep component files under 300 lines
- Separate concerns: containers vs presentational components
- Use meaningful component names

### Hooks Usage

- Use `useEffect` for side effects
- Use `useContext` for global state
- Avoid hooks in conditions
- Dependencies array must be complete

### File Organization

- One main component per file
- Related hooks in same file
- Tests in separate files with `.test.jsx` extension

## Git Workflow

### Commit Messages

- Use conventional commits format: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore
- Subject in imperative mood
- Keep subject under 50 characters
- Detailed description on separate lines

### Examples

```
feat(auth): add OAuth2 integration
fix(booking): handle null check-out date
docs(api): update endpoint documentation
refactor(utils): simplify validation logic
```
