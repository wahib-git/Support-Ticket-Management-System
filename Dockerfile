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

# Créer un user non-root "nodeuser"
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs


# Copie uniquement node_modules de deps
COPY --from=deps /app/node_modules ./node_modules

COPY . .


# Changer propriétaire des fichiers à nodeuser
RUN chown -R nodeuser:nodejs /app

# Utiliser l'utilisateur non-root
USER nodeuser

EXPOSE 3000

CMD ["npm", "start"]