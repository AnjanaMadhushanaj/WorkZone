FROM node:20-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci

COPY . .


RUN npm run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 8080

USER nginx

CMD ["nginx", "-g", "daemon off;"]
