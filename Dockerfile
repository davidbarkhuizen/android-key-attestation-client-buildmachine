FROM buildmachine:base

RUN mkdir -p /root/.ssh
RUN chmod 0700 /root/.ssh

RUN ssh-keyscan github.com > /root/.ssh/known_hosts
RUN ln -s /run/secrets/id_rsa /root/.ssh/id_rsa

WORKDIR /server/node

ENTRYPOINT [ "npm", "run", "dev" ]