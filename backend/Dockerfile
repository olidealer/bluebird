# Stage 1: Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Builder image for prisma client and migrations
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client
RUN npx prisma generate

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app
# Copy dependencies and prisma client from previous stages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose port and run migrations and start command
EXPOSE 5000
CMD sh -c "npx prisma migrate dev --name init --skip-generate && npm run dev"