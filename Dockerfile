# Get specific node version (less risk)
FROM node:6.9.2

# Add app user and create directory for datatables plugin
RUN useradd --user-group --create-home --shell /bin/false app \
   && mkdir -p /home/app/breakpad

#ENV HOME=/home/app

# Copy over package.json and dependdent files
#RUN mkdir -p $HOME/breakpad/plugins/datatables.net-bs4
COPY package.json $HOME/breakpad

RUN npm install \
    && chown -R app:app $HOME/*

# Change to app user and set working directory
USER app
WORKDIR $HOME/breakpad

# Bundle app source
COPY . $HOME/breakpad

CMD [ "node", "index.js" ]
