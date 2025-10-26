FROM ubuntu:noble

#Install Nodejs
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash -  && \
    apt-get upgrade -y  && \
    apt-get install -y nodejs

#Install Git
RUN apt-get install -y git


WORKDIR /home/my-app-container

COPY package*.json ./

#Install dependencies
RUN npm install

COPY script.js ./
COPY ./core/ ./core/

#Run script at run time
CMD ["node","script.js"]











