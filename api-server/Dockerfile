

FROM node:lts AS base

RUN apt-get -y update
RUN apt-get -y upgrade
#RUN apt-get install -y ffmpeg

COPY package*.json ./

RUN npm install
# ENV NODE_ENV=development
#FROM base AS builddev

COPY . .

RUN npm run build

#CMD ["npm", "run", "build"]

#FROM build-dev AS dev

EXPOSE 8080

ENTRYPOINT [ "npm", "start" ]

#CMD ["npm", "start"]