FROM node:12-buster-slim

ADD . /home/

WORKDIR /home

RUN npm i

CMD ["npm", "run", "dev"]
