# ===================================================
# Stage 1: Builder — Install dependencies
# ===================================================
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy lockfile and manifest first (layer caching)
COPY package.json bun.lock ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# ===================================================
# Stage 2: Runner — Lean production image
# ===================================================
FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy installed node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source code and config files
COPY src ./src
COPY drizzle.config.ts ./
COPY tsconfig.json ./
COPY package.json ./

# Expose the application port (matches PORT env var)
EXPOSE 3000

# Run the app with Bun
CMD ["bun", "src/index.ts"]
