# Testing Guide

## Backend Testing

### Unit Testing Setup

1. Install Jest:
```bash
npm install --save-dev jest @types/jest
```

2. Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/dist/**'],
};
```

### Writing Tests

Example unit test for validator utility:

```javascript
// tests/validator.test.js
const { validateEmail, validatePhone } = require('../utils/validator');

describe('Validator Utils', () => {
  test('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });

  test('should validate phone number', () => {
    expect(validatePhoneNumber('9876543210')).toBe(true);
  });
});
```

## Frontend Testing

### Vitest Setup

1. Already configured in client package.json
2. Run tests: `npm run test`
3. Watch mode: `npm run test:watch`

### Component Testing Example

```javascript
// tests/Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Integration Testing

### API Testing

```javascript
// tests/api.integration.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  test('POST /api/auth/login returns token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

## Test Coverage

Run coverage report:
```bash
npm test -- --coverage
```

Aim for minimum 80% coverage on critical paths.
