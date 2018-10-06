# Node for express by Miroslaw Dubaj
FROM node:6-alpine

# opening port
EXPOSE 8080

# tini - zombie process killer
RUN apk add --update tini

# adding bash for docker exec
RUN /bin/sh -c "apk add --no-cache bash"

# creating working directory
RUN mkdir -p usr/src/app

# setting working directory
WORKDIR /usr/src/app

# copying package.json of project
COPY package.json package.json

# installing dependencies
RUN npm install && npm cache clean

# copying project content
COPY . .

# start container commands with endpoint in bin/www
CMD ["tini","--", "node", "./bin/www"]
