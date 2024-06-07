FROM node as base

WORKDIR /src
COPY package*.json /
RUN npm install

FROM base as dev
ENV NODE_ENV=development
EXPOSE 8080

COPY . .

RUN npm run build

FROM dev as devstart

CMD ["npm", "start"]