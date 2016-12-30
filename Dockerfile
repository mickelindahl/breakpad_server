FROM node:6.9.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json /usr/src/app
COPY . /usr/src/app
RUN npm install

# Bundle app source

EXPOSE 4000

CMD [ "node", "index.js" ]