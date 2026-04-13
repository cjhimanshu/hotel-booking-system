#!/bin/bash
# setup-linting.sh - Setup linting and formatting tools

echo "Setting up linting and formatting..."

# Install Prettier globally (optional)
npm install --global prettier

# Install ESLint for backend (if not already installed)
cd server
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
cd ..

# Install ESLint for client (already configured)
cd client
npm install --save-dev prettier-eslint
cd ..

echo "Linting setup complete!"
