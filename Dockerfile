# The official nodejs docker image
FROM node:9-alpine@sha256:c812a92b98800c243bd4bafbc5a528b4fdf4bcd57a1d8de4192deded085ba6da

LABEL maintainer="epicallan.al@gmail.com"
# Copy package.json only to temp folder, install its dependencies,
# set workdir and copy the dependnecies there
RUN mkdir /src
# This way, dependnecies are cached without the need of cacheing all files.
ADD package.json /tmp/
RUN cd /tmp && npm install --silent
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
