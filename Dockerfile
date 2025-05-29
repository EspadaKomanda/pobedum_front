FROM node:21-alpine as stage1
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:21-alpine as stage2
WORKDIR /app
COPY . .
COPY --from=stage1 /app/node_modules ./node_modules
RUN npm run build

FROM node:21-alpine as final
WORKDIR /app
ENV NODE_ENV production
COPY --from=stage2 /app ./

EXPOSE 3000
CMD ["npm", "start"]