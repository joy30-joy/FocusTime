# Use official Node image
FROM node:18

# Set working directory
WORKDIR /workspace

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Default command (modify as needed)
CMD ["npm", "run", "dev"]