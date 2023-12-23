### STAGE 1: Build ###
FROM node:18.17.0 AS builder
WORKDIR /home/node
ENV NPM_CONFIG_CACHE=/home/node/.npm
ENV PATH="./node_modules/.bin:$PATH"
ENV INLINE_RUNTIME_CHUNK=false
ENV REACT_APP_API_HOST=""

COPY --chown=node:node . /home/node
RUN npm run build

### STAGE 2: Production ###
FROM nginx:latest
COPY --from=builder --chown=nginx:nginx /home/node/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /home/node/build /etc/nginx/html
COPY --from=builder --chown=nginx:nginx /home/node/build/index.html /etc/nginx/html/200.html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
