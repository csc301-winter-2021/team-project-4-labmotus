FROM node:15-alpine
WORKDIR /app
COPY labmotus-project .
RUN npm i
RUN npm i --prefix common/types
WORKDIR cloud
RUN npm i
CMD ["npm","run","start"]
EXPOSE 5000
