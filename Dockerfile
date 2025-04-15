FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (adjust if your app runs on a different port)
EXPOSE 8000

# Start the app with experimental fetch support
CMD ["npm", "start"]
