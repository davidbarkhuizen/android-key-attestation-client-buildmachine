# android build machine

## specification

single-repo build machine

http API

## setup

### ssh

rsa 4096bit keypair
`ssh-keygen -t rsa -b 4096`

sudo useradd buildmachine -m
sudo passwd -d buildmachine

sudo apt-get install openssh-server



sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh

$ sudo ufw allow ssh/tcp
$ sudo ufw logging on
$ sudo ufw enable
$ sudo ufw status



install ssh os package

$ sudo apt install ssh

edit config @ /etc/ssh/sshd_config:

uncomment:

PasswordAuthentication yes

change to

PasswordAuthentication no

add:

Match group sftp
ChrootDirectory /home
X11Forwarding no
AllowTcpForwarding no
ForceCommand internal-sftp

sudo useradd -m buildmachine -g sftp

add the contents of rsa_id.pub to ~/.ssh/authorized_keys

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys


sudo systemctl restart ssh.service

chmod 600 ~/.ssh/id_rsa;

addgroup sftp

usermod -a -G sftp buildmachine

sudo chmod go-w /home/buildmachine /home/buildmachine/.ssh 
