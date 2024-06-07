FROM node:lts AS base

COPY package*.json ./

RUN npm install

FROM base AS dev

COPY . .

CMD ["npm", "run", "build"]