# The official nodejs docker image
FROM node:9-alpine@sha256:c6c2bbd87a7e142b5d991a2e860ed808756ed67a7e63a2281e8fbc246b5aed00

LABEL maintainer="epicallan.al@gmail.com"
# Copy package.json only to temp folder, install its dependencies,
# set workdir and copy the dependnecies there
RUN mkdir /src
# This way, dependnecies are cached without the need of cacheing all files.
ADD package.json /tmp/
RUN cd /tmp && npm install -g yarn --silent && yarn --silent
RUN cp -a /tmp/node_modules /src/

WORKDIR /src

# Copy the rest of the files to the container workdir
COPY . /src

RUN npm run build

ARG DB_USER
ARG DB_HOST
ARG DB_PORT
ARG DB_PASSWORD
ARG DB_DATABASE
ENV DB_USER=$DB_USER
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_DATABASE=$DB_DATABASE
ENV NODE_ENV='production'
ENV PORT=3000

EXPOSE ${PORT}

RUN npm install pm2 -g --silent

CMD ["pm2-docker", "process.yml"]
