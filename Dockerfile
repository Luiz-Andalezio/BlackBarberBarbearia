FROM node:18

WORKDIR /blackbarberweb

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
