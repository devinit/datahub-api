# The official nodejs docker image
FROM node:8.4-alpine

# Copy package.json only to temp folder, install its dependencies,
# set workdir and copy the dependnecies there
RUN mkdir /src
# This way, dependnecies are cached without the need of cacheing all files.
ADD package.json /tmp/
RUN cd /tmp && npm install --silent
RUN cp -a /tmp/node_modules /src/

WORKDIR /src

# Copy the rest of the files to the container workdir
ADD . /src

RUN npm run build

ARG DB_USER
ARG DB_HOST
ARG DB_PORT
ARG DB_PASSWORD
ARG DB_DATABASE
ENV NODE_ENV='production'
ENV PORT=3000

EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
