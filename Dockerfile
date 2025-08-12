# Используем многоэтапную сборку для уменьшения размера итогового образа
FROM node:lts-slim AS builder
WORKDIR /usr/src/app

# Копируем только файлы, необходимые для установки зависимостей
COPY package.json ./
COPY kobalte-core-0.13.10.tgz ./

# Устанавливаем зависимости (включая devDependencies для сборки)
RUN npm install

ENV VITE_SERVER_GQL=https://api.rating.ru/query

# Копируем остальные файлы и собираем проект
COPY . .
RUN npm run build

# Финальный образ
FROM node:lts-slim AS application
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Копируем только необходимые файлы из этапа builder
# COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
ENV VITE_SERVER_GQL=https://raiting.ru/query

# Очищаем кэш npm
RUN npm cache clean --force

# Устанавливаем простой HTTP-сервер для обслуживания статических файлов
RUN npm install -g serve

EXPOSE 3000
USER node
CMD ["serve", "-s", "dist", "-l", "3000"]
