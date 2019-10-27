FROM node:12

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package.json
COPY yarn.lock yarn.lock

COPY ./index.js ./
COPY ./typeDefs.graphql ./

RUN yarn

CMD ["yarn", "start"]