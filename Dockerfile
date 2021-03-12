FROM node:15-alpine
WORKDIR /app
COPY labmotus-project/cloud .
CMD ["node","dist/cloud/src/server.js"]
EXPOSE 5000
