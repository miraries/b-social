FROM node:14.5.0-stretch

EXPOSE 8000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
COPY .env.example .env

CMD ["npm", "run", "start:prod"]