# Use the official Node.js image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port for debugging (optional)
EXPOSE 3000

# Command to run the script
CMD ["node", "query_unoptimized_db.js"]
