# Get specific node version (less risk)
FROM node:6.9.4

ARG GIT_ASKPASS
ARG HOME
ARG APP_NAME


# Add app user and create directory for datatables plugin
RUN useradd --user-group --create-home --shell /bin/false app \
   && mkdir -p /home/app/breakpad/plugins/datatables.net-bs4

# Copy over package.json and dependdent files
COPY package.json $HOME/breakpad
COPY plugins/datatables.net-bs4 $HOME/breakpad/plugins/datatables.net-bs4

RUN chown -R app:app $HOME/*

# Change to app user and set working directory
USER app
WORKDIR $HOME/breakpad

RUN npm install

# Bundle app source
COPY . $HOME/$APP_NAME

CMD [ "node", "index.js" ]
