
FROM node:20-alpine3.18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:20-alpine3.18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]