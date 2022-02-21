FROM node:12.16.3

ENV PORT 80

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "app.js"]