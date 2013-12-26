#!/bin/bash
NODE_VERSION="v0.10.24"
ARCH="NONE"

case $(uname -m) in
  "x86_64")
    ARCH="x64"
    ;;
  "i686")
    ARCH="x86"
    ;;
    *)
    echo "Sorry, your architecture is not yet supported by ChromeGet!"
    exit 1
    ;;
esac

NODE_URL="http://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-${ARCH}.tar.gz"

echo "Using Node version ${NODE_VERSION} on ${ARCH}"

wget -O- ${NODE_URL} | sudo tar zxf - -C/usr/local --strip-components=1

echo "Installing ChromeGet"

sudo npm install chromeget -g
