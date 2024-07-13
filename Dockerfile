FROM node:21-alpine

RUN mkdir -p /home/lambda/node_modules && chown -R node:node /home/lambda

WORKDIR /home/lambda

COPY package*.json ./
USER node
RUN npm install

# inject lambda code
ONBUILD ADD . .

COPY --chown=node:node wrapper wrapper

CMD ["nodejs", "wrapper"]
