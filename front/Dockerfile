FROM node:14.5.0-stretch as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
RUN mkdir app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]