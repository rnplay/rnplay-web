FROM node:7

RUN apt-get update && \
    apt-get -y install software-properties-common curl git-core build-essential automake unzip

RUN git clone -b v4.7.0 https://github.com/facebook/watchman.git /tmp/watchman
WORKDIR /tmp/watchman
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install
RUN mkdir -p /usr/local/var/run/watchman/

RUN mkdir -p /app
WORKDIR /app
ADD packager.babelrc .babelrc

ADD packager-package.json package.json
RUN npm install

EXPOSE 8081

CMD ["node_modules/react-native/packager/packager.sh", "--assetExts=ttf"]
