FROM node:14.15.4

ENV NODE_ENV=production
ENV RUN_ENV=docker

WORKDIR /app

RUN npm install

COPY . .

CMD ["node", "index.js"]