FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
ENV EXPO_NO_DOCTOR=1
RUN npx expo export --platform web

FROM python:3.12-slim

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY serve.py .

CMD ["python3", "serve.py"]
