FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server.ts tsconfig.json ./
COPY scripts/ ./scripts/

# Build the OpenAPI spec (production URL)
ENV ZUDOKU_PUBLIC_BACKEND_URL=https://zudoku-backend.onrender.com
RUN npx tsx scripts/manage-openapi.ts

# Expose port
EXPOSE 3000

# Start the server
CMD ["npx", "tsx", "server.ts"]
