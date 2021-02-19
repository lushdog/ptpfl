FROM node:14.15.4

ENV NODE_ENV=production
ENV RUN_ENV=docker

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["node", "index.js"]