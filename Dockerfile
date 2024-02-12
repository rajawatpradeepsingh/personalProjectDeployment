# SET default APP_DIR path
ARG APP_DIR=/rcp-frontend
# to elect environment to build pass variable as :local, :dev, :prod
ARG ENV
# Stage 1
# ---------------------------------------------------

FROM node:14-alpine3.16 as stage1

# import external ARG into this stage
ARG APP_DIR
ARG ENV

# Update latest security patches
#RUN apk update && apk upgrade


# Create APP_DIR path and set permissions
#RUN mkdir -p $APP_DIR

# Change working directory to application directory
WORKDIR $APP_DIR

# Copy package.json to /app directory
COPY package.json ./

# Install node modules/dependencies
RUN npm install 
RUN npm install -g env-cmd

# Copy application code
COPY . .
 
# Create production build of React App
RUN npm run build${ENV} --loglevel verbose 

# Stage 2
# ---------------------------------------------------

# Choose NGINX as our base Docker image
FROM nginx:1.23.3

# import external ARG into this stage
ARG APP_DIR

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf *

# Copy static assets from builder stage
COPY --from=stage1 $APP_DIR/build .

COPY nginx.conf /etc/nginx/nginx.conf

# RUN adduser webuser -
# RUN addgroup rcp-frontend && adduser -S -G rcp-frontend webuser

# RUN chown -R webuser:rcp-frontend $APP_DIR
# RUN chmod -R 777 $APP_DIR

# Switch user to non-privileged user
# USER webuser

# Expose this port on DOCKER NETWORK (NOT HOST MAPPING)
EXPOSE 80

# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]