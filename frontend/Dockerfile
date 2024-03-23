FROM node:18-alpine

WORKDIR /frontend

EXPOSE 3000

COPY public/ /frontend/public
COPY src/ /frontend/src
COPY package.json /frontend/
COPY package-lock.json /frontend/

RUN npm install

CMD ["npm", "start"]