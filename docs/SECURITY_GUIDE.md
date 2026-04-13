# Security Best Practices

## Authentication & Authorization

### Password Security
- Passwords are hashed using bcryptjs (10 salt rounds)
- Never store plain text passwords
- Enforce minimum password length of 6 characters
- Consider implementing password strength requirements

### JWT Tokens
- Store tokens securely in httpOnly cookies when possible
- Set token expiration (recommended 24 hours)
- Refresh tokens should be separate and longer-lived
- Never expose tokens in logs or error messages

### CORS Configuration
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
```

## Data Protection

### Input Validation
- Validate all user inputs on backend (never trust client)
- Use sanitization to prevent XSS attacks
- Implement rate limiting on login endpoints
- Validate file uploads (type, size, virus scan)

### SQL Injection Prevention
- Use parameterized queries (Mongoose handles this)
- Never concatenate user input into queries
- Use ORM methods instead of raw queries

### HTTPS/TLS
- Always use HTTPS in production
- Use security headers (Helmet middleware)
- Implement HSTS (HTTP Strict Transport Security)

## Database Security

### Environment Variables
- Store sensitive data as environment variables
- Use `.env.example` for documentation, not `.env`
- Never commit `.env` file to repository
- Rotate credentials regularly

### Database Access
- Use strong passwords for database users
- Limit database user permissions (principle of least privilege)
- Enable MongoDB authentication
- Use IP whitelisting for database access

## API Security

### Content Security Policy
- Set appropriate CSP headers
- Restrict external scripts and resources
- Use nonce values for inline scripts

### Sensitive Information
- Never log sensitive data (passwords, tokens, emails)
- Implement proper error messages (don't expose system details)
- Use security headers to prevent clickjacking

## Deployment Security

### Production Checklist
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Enable database authentication
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable security headers (Helmet)
- [ ] Use strong JWT_SECRET
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated
