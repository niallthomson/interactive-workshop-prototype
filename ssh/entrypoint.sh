#!/bin/bash

set -e

useradd -s /bin/zsh -u 1000 -m workshop 

mkdir -p /home/workshop/.ssh
touch /home/workshop/.ssh/authorized_keys
touch /home/workshop/.hushlogin

chown -R workshop:workshop /home/workshop

mkdir -p /keys

touch /home/workshop/.zshrc

runuser -l workshop -c 'ssh-keygen -b 2048 -t rsa -f ~/.ssh/id_rsa -q -N ""'

runuser -l workshop -c 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"'

cp /home/workshop/.ssh/id_rsa* /keys

chmod 644 /keys/id_rsa

cat /keys/id_rsa.pub >> /home/workshop/.ssh/authorized_keys

sed -ri 's/^#?Port\s+.*/Port 2222/' /etc/ssh/sshd_config
sed -ri 's/^#?PasswordAuthentication\s+.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin no/' /etc/ssh/sshd_config

/usr/sbin/sshd -D