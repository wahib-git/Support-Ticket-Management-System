# -------- Base image --------
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# -------- Dependencies --------
FROM base AS deps
RUN npm ci --omit=dev

# -------- Release image --------
FROM node:22-alpine AS release
WORKDIR /app

# Copie uniquement node_modules de deps
COPY --from=deps /app/node_modules ./node_modules

COPY . .
# Changer l’utilisateur root par 'node'
USER node

EXPOSE 3000

CMD ["npm", "start"]