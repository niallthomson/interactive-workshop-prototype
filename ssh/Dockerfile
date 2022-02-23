FROM ubuntu:18.04

RUN apt-get update && apt-get install -y openssh-server zsh curl nano wget git vim unzip sudo && mkdir /var/run/sshd

# TODO: Verify checksum (https://github.com/mikesir87/aws-cli-docker/blob/master/Dockerfile)
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  sudo ./aws/install && \
  rm -rf awscliv2.zip ./aws

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY motd /etc/motd

COPY ./entrypoint.sh /tmp/entrypoint.sh
RUN  chmod +x /tmp/entrypoint.sh

EXPOSE 2222

ENTRYPOINT ["/tmp/entrypoint.sh"]