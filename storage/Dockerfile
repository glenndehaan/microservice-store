FROM alpine:3.14

# Install packages
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Create production build
#RUN npm ci --only=production

# Expose app
EXPOSE 5000

# Run app
CMD ["node", "/app/server.js"]
