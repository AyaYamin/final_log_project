# =====================
# Build stage
# =====================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# =====================
# Production stage
# =====================
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/db/migrations ./src/db/migrations


# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup


# Change ownership
RUN chown -R appuser:appgroup /app


# Use non-root user
USER appuser


EXPOSE 8080

CMD ["npm", "start"]