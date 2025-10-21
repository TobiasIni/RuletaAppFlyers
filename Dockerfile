# Usa la imagen oficial de Node.js como base
FROM node:20-alpine AS base

# Instala dependencias solo cuando sea necesario
FROM base AS deps
# Verifica https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué podría ser necesario libc6-compat.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Reconstruye el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Las variables de entorno deben ser proporcionadas en tiempo de build para Next.js
# Next.js recopila telemetría completamente anónima sobre el uso general.
# Más información aquí: https://nextjs.org/telemetry
# Descomenta la siguiente línea en caso de que quieras deshabilitar la telemetría durante el build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Imagen de producción, copia todos los archivos y ejecuta next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Descomenta la siguiente línea en caso de que quieras deshabilitar la telemetría durante runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Establece el permiso correcto para el prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automáticamente aprovecha los output traces para reducir el tamaño de la imagen
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010

ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

