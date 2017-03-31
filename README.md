
[ ![Codeship Status for mickelindahl/breakpad_server](https://app.codeship.com/projects/e1128c80-70a6-0134-4920-4adf8fbeb56c/status?branch=master)](https://app.codeship.com/projects/178198)
[![Coverage Status](https://coveralls.io/repos/github/mickelindahl/breakpad_server/badge.svg?branch=master)](https://coveralls.io/github/mickelindahl/breakpad_server?branch=master)


# Breakpad server
A simple breakpad server built on [Hapi](http://hapijs.com) and postgresql.


## Installation

Clone the repository and `cd` into it

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

Copy `sample.docker-compose.yml` to `docker-compose.yml`. Open it and add DB user and password, prefered ports and/or
VIRTUAL_HOST. Edit it accordingly prefered setup. 

With nginx as a reverse proxy ([nginx/jwilder](https://github.com/jwilder/nginx-proxy)) use:
 ```
 environment:
     VIRTUAL_HOST: {domain/subdomain}
```
 Without one can use
 ```
ports:
  - "{port os}:4000"
```

Build image and container with:
 ```
 docker-compose up -d
 ``` 
To force rebuild if needed of breakpad image run `docker-compose up -d --build`

If all when fine then the server should be up and running

The database can be access externally through 

## Jenkins
node-gyp is needed so add node-gyp as global package for the node installation
and also ensure that make is installed in jenkins container. 
Enter jenkins container as root docker exec -it jenkins --user root /bin/bash and runapt-get install build-essential

##Testing

To upload a file for testing

Download [google breakpad](https://chromium.googlesource.com/breakpad/breakpad/) code

From project folder got to symupload
```
cd src/src/tools/linux/symupload
```

To upload a test dump run 
```
./minidump_upload -p {project} -v {version} ../../../processor/testdata/linux_divide_by_zero.dmp {server ur}/crash_dumps
```

```
/git/breakpad/src/src/tools/linux/symupload$ ./sym_upload -v 0.0.1 /home/mikael/tmp/MuPDFWrapper.exe https://crashboombang.herokuapp.com/symbols
./sym_upload -v 0.0.1 /home/mikael/git/breakpad/src/src/processor/testdata/symbols/overflow/B0E1FC01EF48E39CAF5C881D2DF0C3840/overflow.sym https://crashboombang.herokuapp.com/symbols
./minidump_upload -p loredge -v 0.0.1 /home/mikael/git/breakpad/src/src/processor/testdata/linux_divide_by_zero.dmp https://crashboombang.herokuapp.com/crash_dumps
```