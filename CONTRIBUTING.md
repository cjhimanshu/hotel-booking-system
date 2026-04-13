#!/bin/bash

# CONTRIBUTING.md - Guidelines for contributors

## Welcome to the Hotel Booking System!

Thank you for your interest in contributing to this project. Please follow these guidelines to ensure a smooth contribution process.

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/hotel-booking-system.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`

### Development Setup

1. Install dependencies:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Set up environment variables as described in README.md

3. Start development servers:

   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

### Code Standards

- Follow the `.prettierrc` configuration for code formatting
- Run ESLint: `npm run lint` in client directory
- Write clear, descriptive commit messages
- Add comments for complex logic

### Making Changes

- Keep commits focused and atomic
- Test your changes before pushing
- Update documentation if needed

### Submitting a Pull Request

1. Push to your fork
2. Open a Pull Request with a clear description
3. Wait for review and address feedback
4. Ensure all CI checks pass

### Reporting Issues

When reporting bugs, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Your environment (OS, Node version, etc.)

---

Thank you for contributing!
