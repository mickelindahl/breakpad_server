
[ ![Codeship Status for mickelindahl/breakpad_server](https://app.codeship.com/projects/e1128c80-70a6-0134-4920-4adf8fbeb56c/status?branch=master)](https://app.codeship.com/projects/178198)
[![Coverage Status](https://coveralls.io/repos/github/mickelindahl/breakpad_server/badge.svg?branch=master)](https://coveralls.io/github/mickelindahl/breakpad_server?branch=master)


# Breakpad server
A simple breakpad server built on [Hapi](http://hapijs.com) and postgresql.


## Installation

Copy `sample.env` to `.env` and enter valid keys for your setup.

- `HOST` The host server is running on. For docker use 0.0.0.0
- `PORT` Specific port server should have e.g. 3000
- `DATABASE_URL` The postgres connection.
   - For NPM installation use `postgres://{user}:{password}@}{host}:{port}/breakpad`.  
   - For docker installation use `postgres://{user}:{password}@db:5432/breakpad` this will be set further down in `docker-compose.yml`.
- `JWT_SECRET` Json web token secret e.g my_secret (used to create webtokens for login)
- `BREAKPAD_SERVER_USER` Login username 
- `BREAKPAD_SERVER_PASSWORD` Login password

### NPM
Get started with the server by cloning this repo, `cd` into it and install all dependent modules:
```
npm install
```

That's all! Now start with

```
node index.js
```

and lean back and enjoy!

###DOCKER

From app directory run 
```
mkdir -p postgres/data && mkdir -p postgres/dumpall
```

Clone the repository and `cd` into it

Copy `sample.docker-compose.yml` to `docker-compose.yml`. Open it and add DB user and password. Edit it accordingly prefered setup. 

With nginx as a reverse proxy ([nginx/jwilder](https://github.com/jwilder/nginx-proxy)) use:
 ```
 environment:
     VIRTUAL_HOST: {domain/subdomain}
     VIRTUAL_PORT: 4000/5432
```
 Without one can use
 ```
ports:
  - "{port os}:4000/5432"
```

Build image and container with:
 ```
 docker-compose up -d
 ``` 
To force rebuild if needed of breakpad image run `docker-compose up -d --build`

If all when fine then the server should be up and running

The database can be access externally through 

