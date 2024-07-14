# NodeJS Function

Wrap lambda code with JavaScript for KubeLambda project
It wraps docker build of the JS code and execute it. For example take a look into [Dockerfile](./example/example_lambda/Dockerfile)

Project uses [projen](./.projenrc.js) for housekeeping

## Install

```sh
npx projen
```

## Build and run with example code

```sh
docker build --no-cache -t function-nodejs . ; docker run --network host --rm -it $(docker build -q example/example_lambda/)
```

## Configuration

See [config.js](./wrapper/config.js)

TODO: 
- Proper logging
- Proper configuration
