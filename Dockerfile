FROM android-buildmachine:node

WORKDIR /opt/fluid-build-server

COPY ./node/package*.json ./
RUN npm install
COPY ./node/src ./src

EXPOSE 8080

CMD [ "node", "src/server.js" ]