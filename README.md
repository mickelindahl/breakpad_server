
[ ![Codeship Status for mickelindahl/breakpad_server](https://app.codeship.com/projects/e1128c80-70a6-0134-4920-4adf8fbeb56c/status?branch=master)](https://app.codeship.com/projects/178198)

# Breakpad server
A simple breakpad server built on [Hapi](http://hapijs.com) and postgresql. 

## Installation
Get started with the server by cloning this repo, `cd` into it and install all dependent modules:
```
npm install
```

Copy `sample.env` to `.env` and enter valid keys for your setup.

- `HOST` The host server is running on e.g. 0.0.0.0
- `PORT` Specific port server should have e.g. 3000
- `DATABASE_URL` The postgres connection e.g postgres://{user}:{password}@localhost:5432/breakpad
- `JWT_SECRET` Json web token secret e.g my_secret
- `BREAKPAD_SERVER_USER` User name for login e.g me
- `BREAKPAD_SERVER_PASSWORD` Password for login e.g what?

That's all! Now start with

```
node index.js
```

and lean back and enjoy!


