FROM node:21-alpine AS build

WORKDIR /app

COPY package.json . 

RUN npm install 

COPY . .

RUN npm run build

FROM node:21-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 80

CMD ["serve", "-l", "80", "-s", "build"] 
