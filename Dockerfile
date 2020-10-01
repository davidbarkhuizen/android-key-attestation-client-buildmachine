FROM android-buildmachine:node

WORKDIR /opt/fluid-build-server

COPY ./node/package*.json ./
RUN npm install
COPY ./node/src ./src

RUN mkdir -p /root/.ssh
RUN chmod 0700 /root/.ssh
RUN ssh-keyscan github.com > /root/.ssh/known_hosts

EXPOSE 8080

CMD [ "node", "src/server.js" ]