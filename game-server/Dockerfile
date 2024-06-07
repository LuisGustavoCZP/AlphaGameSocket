FROM node as base

WORKDIR /src
COPY package*.json /
RUN npm install

FROM base as dev
ENV NODE_ENV=development
EXPOSE 5000

COPY . .

RUN npm run build

CMD ["npm", "start"]