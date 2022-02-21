FROM node:12.16.3

WORKDIR /app

ENV PORT 80

COPY package.json /app

RUN npm install

COPY . /app

CMD ["node", "app.js"]