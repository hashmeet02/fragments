# Build the fragments microservice api

##############################################################
#Stage 0: Install the dependencies
FROM node:20.10.0@sha256:8d0f16fe841577f9317ab49011c6d819e1fa81f8d4af7ece7ae0ac815e07ac84 as dependencies

# Metadata tags
LABEL maintainer="Hashmeet Singh Saini <hsaini28@myseneca.ca>"
LABEL description="Fragments node.js microservice"

#Environment varables
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json /app/

# Copy src to /app/src/
COPY ./src ./src

# Install node dependencies defined in package-lock.json
RUN npm ci

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

################################################################
#Stage 2: Build the server with alpine
FROM node:21-alpine3.18@sha256:911976032e5e174fdd8f5fb63d7089b09d59d21dba3df2728c716cbb88c7b821 as production

WORKDIR /app

COPY --from=dependencies \
  /app/node_modules/ /app/ \
  /app/src/ /app/ \
  /app/package.json ./

# We default to use port 8080 in our service
ENV PORT=8080

# Set healthcheck for the server
HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
  
# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080





