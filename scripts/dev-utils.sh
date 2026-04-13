#!/bin/bash
# Development utilities and commands

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start development servers
start_dev() {
  echo -e "${GREEN}Starting development servers...${NC}"
  
  # Start backend in background
  cd server
  npm run dev &
  BACKEND_PID=$!
  cd ..
  
  # Start frontend
  cd client
  npm run dev
  cd ..
  
  # Cleanup on exit
  trap "kill $BACKEND_PID" EXIT
}

# Function to run tests
run_tests() {
  echo -e "${GREEN}Running tests...${NC}"
  cd server && npm test
  cd ../client && npm test
}

# Function to build for production
build_prod() {
  echo -e "${GREEN}Building for production...${NC}"
  cd server && npm run build
  cd ../client && npm run build
}

# Function to clean dependencies
clean() {
  echo -e "${YELLOW}Cleaning dependencies...${NC}"
  rm -rf server/node_modules client/node_modules
  rm -rf server/package-lock.json client/package-lock.json
  npm install --prefix server
  npm install --prefix client
}

# Main script
case "$1" in
  dev)
    start_dev
    ;;
  test)
    run_tests
    ;;
  build)
    build_prod
    ;;
  clean)
    clean
    ;;
  *)
    echo "Usage: ./dev-utils.sh {dev|test|build|clean}"
    exit 1
    ;;
esac
