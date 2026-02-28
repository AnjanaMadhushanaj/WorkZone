FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

EXPOSE 5000

USER node

CMD ["node", "index.js"]
