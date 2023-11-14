FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
ENV MONGODB_URI=mongodb://localhost:27017/notes_db
ENV SESSION_SECRET=uihrfhwuhfhu729826821##425360-04nnvwen

EXPOSE 5000

CMD ["npm","start"]