FROM node:lts-alpine
# Linux Alpine does not have bash installed by default
RUN apk update && apk upgrade && apk add bash
RUN mkdir -p /home/developer/companies-service
WORKDIR /home/developer/companies-service
COPY . .
RUN npm install
EXPOSE 5000
# Using this script we can run local or production build step
ENTRYPOINT [ "./cmd.sh" ]
