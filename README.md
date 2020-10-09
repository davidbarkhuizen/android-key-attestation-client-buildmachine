# android build machine

## specification

single-repo build machine

http API

## Setup

ubuntu 20-04

### install sshd on server & configure

### debug

#### turn on verbose logging for ssh & sshd

1. turn on verbose logging for sshd server:
```
$ sudo gedit /etc/ssh/sshd_config
set: LogLevel DEBUG
```

2. turn on verbose logging when connecting with ssh | scp:
```
???
```

#### launch interactive bash shell on running docker container 

1. get target container id
```
sudo docker ps
```

2. launch interactive bash shell on target image with container id c5a80cf009d4 
```
sudo docker exec -it /bin/bash c5a80cf009d4
```

### steps

install apt os package    
```
$ sudo apt install ssh
```
  
configure sshd @ `/etc/ssh/sshd_config`  

```
$ sudo gedit /etc/ssh/sshd_config
```

force public-key only login:  
```
PasswordAuthentication no
```

enable, start, check status  

```
$ sudo systemctl enable ssh  
$ sudo systemctl start ssh  
$ sudo systemctl status ssh  
```

create firewall rule to allow logged incoming connection  
```
$ sudo ufw allow ssh/tcp 
$ sudo ufw logging on  
$ sudo ufw enable  
$ sudo ufw status  
```

#### create and configure user buildmachine on server

create user buildmachine, with home directory
```
$ sudo useradd buildmachine -m
```

disable password-based login for user buildmachine
```
$ sudo passwd -d buildmachine
```

/home/$USER/.ssh
```
$ sudo mkdir /home/buildmachine/.ssh  
# give only root user only r/w/x to directory /home/buildmachine/.ssh
$ chmod 700 /home/buildmachine/.ssh
```

/home/$USER/.ssh/authorized_keys
```
$ sudo touch /home/buildmachine/.ssh/authorized_keys  
# give only (buildmachine) user access to `/home/buildmachine/.ssh/authorized_keys` 
$ sudo chmod 600 /home/buildmachine/.ssh/authorized_keys
```

```
sudo chown -R buildmachine:buildmachine /home/buildmachine/.ssh/
```

make transfer folder to accept incoming scp file
```
$ sudo mkdir /home/buildmachine/transfer/
$ sudo chown buildmachine:buildmachine /home/buildmachine/transfer/
```

?? $ sudo chmod go-w /home/buildmachine /home/buildmachine/.ssh 




create 4096-bit rsa keypair: `rsa_id`, `rsa_id.pub`
```
$ ssh-keygen -t rsa -b 4096
```

manually append the contents of `rsa_id.pub` to `home/buildmachine/.ssh/authorized_keys`  


```
```



sudo systemctl restart ssh.service

on the ssh client machine:
chmod 600 ~/.ssh/id_rsa;