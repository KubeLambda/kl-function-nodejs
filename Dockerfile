FROM node:21-alpine as builder

COPY yarn.lock package.json ./
RUN yarn install --pure-lockfile --immutable

FROM node:21-alpine

RUN mkdir -p /home/lambda/node_modules && chown -R node:node /home/lambda
USER node

WORKDIR /home/lambda

COPY                ./package.json  ./
COPY --from=builder ./node_modules/ ./node_modules/

# inject lambda code
ONBUILD ADD . .

COPY --chown=node:node wrapper wrapper

CMD ["nodejs", "wrapper"]
