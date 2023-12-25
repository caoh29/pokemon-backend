<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ npm install
```

```bash
$ npm install -g @nestjs/cli
```

## Running the app

To run the MongoDB as a docker container

```bash
$ docker-compose up -d
```

Clone the **.env.template**, rename it to **.env** and UPDATE THE VARIABLES!

To execute the nestjs app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start
```

To seed the MongoDB with data use:

```bash
$ curl http://localhost:4000/api/pokemon
```

# Production Build

1. Create file `.env.prod`
2. Fill all production environment variables, use **.env.template** structure
3. Create the new image

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
