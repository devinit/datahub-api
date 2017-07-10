# The official nodejs docker image
FROM node:7

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

ENV NODE_ENV="production"
ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "dist/main.min.js"]
