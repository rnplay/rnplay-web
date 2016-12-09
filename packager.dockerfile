FROM node:5.7.1

RUN apt-get update && \
    apt-get -y install software-properties-common git-core build-essential automake unzip python-dev python-setuptools && \
    rm -rf /var/lib/apt/lists/*

RUN git clone -b v4.7.0 https://github.com/facebook/watchman.git /tmp/watchman
WORKDIR /tmp/watchman
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install

ADD packager-package.json /tmp/package.json
RUN cd /tmp && npm install || true
RUN npm install -g react-native-cli node-gyp
RUN mkdir -p /app && cp -a /tmp/node_modules /app/
RUN rm -rf /tmp/* /var/tmp/*
RUN mkdir -p /usr/local/var/run/watchman/

WORKDIR /app

ADD packager.babelrc .babelrc

EXPOSE 8081

CMD ["node_modules/react-native/packager/packager.sh", "--assetExts=ttf"]
