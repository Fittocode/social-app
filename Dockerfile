FROM node:12.16.3

WORKDIR /app

ENV PORT 80

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]