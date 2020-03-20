FROM node:12-buster-slim

WORKDIR /home

ADD package.json package-lock.json ./

RUN npm i

CMD ["npm", "run", "dev"]
