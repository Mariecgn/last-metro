FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
COPY openapi.yaml ./openapi.yaml
EXPOSE 3000
CMD ["node", "src/app.js"]
