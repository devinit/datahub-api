# The official nodejs docker image
FROM node:8

# Copy package.json only to temp folder, install its dependencies,
# set workdir and copy the dependnecies there
# This way, dependnecies are cached without the need of cacheing all files.
ADD package.json /tmp/package.json
RUN set -ex \
	&& cd /tmp \
	&& npm install \
	&& mkdir -p /home/app \
	&& cp -a /tmp/node_modules /home/app/ \

WORKDIR /home/app

# Copy the rest of the files to the container workdir
ADD . /home/app

ENV NODE_ENV="production"
ENV PORT=3000
EXPOSE ${PORT}

CMD ["npm", "start"]
