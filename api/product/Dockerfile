#
# Define OS
#
FROM alpine:3.14

#
# Basic OS management
#

# Install packages
RUN apk add --no-cache nodejs npm

#
# Require _defaults app
#

# Create _defaults directory
WORKDIR /_defaults

# Bundle _defaults source
COPY ./_defaults .

# Install dependencies
RUN npm ci --only=production

#
# Require app
#

# Create app directory
WORKDIR /app

# Bundle app source
COPY ./api/product .

# Install dependencies
RUN npm ci --only=production

#
# Setup app
#

# Expose app
EXPOSE 4001

# Set node env
ENV NODE_ENV=production

# Run app
CMD ["node", "/app/server.js"]
