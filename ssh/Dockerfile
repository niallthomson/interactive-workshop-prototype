FROM ubuntu:18.04

RUN apt-get update && apt-get install -y openssh-server zsh curl nano wget git vim && mkdir /var/run/sshd

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY motd /etc/motd

COPY ./entrypoint.sh /tmp/entrypoint.sh
RUN  chmod +x /tmp/entrypoint.sh

EXPOSE 2222

ENTRYPOINT ["/tmp/entrypoint.sh"]