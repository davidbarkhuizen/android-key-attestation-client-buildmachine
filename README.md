# android build machine

## specification

single-repo build machine

http API

## Setup

ubuntu 20-04

### install sshd on server & configure

install apt os package    
```
$ sudo apt install ssh
```
  
configure sshd @ `/etc/ssh/sshd_config`  

force public-key only login:  
```
PasswordAuthentication no
```

enable, start, check status  

```
sudo systemctl enable ssh  
sudo systemctl start ssh  
sudo systemctl status ssh  
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

create `home/buildmachine/.ssh/authorized_keys`  
```
$ sudo mkdir home/buildmachine/.ssh  
$ sudo touch home/buildmachine/.ssh/authorized_keys  
```

create 4096-bit rsa keypair: `rsa_id`, `rsa_id.pub`
```
$ ssh-keygen -t rsa -b 4096
```

manually append the contents of `rsa_id.pub` to `home/buildmachine/.ssh/authorized_keys`  

give only root user only r/w/x to directory `/home/buildmachine/.ssh`
```
$ sudo chmod 700 /home/buildmachine/.ssh
```

give only (buildmachine) user access to `~/.ssh/authorized_keys` 
```
chmod 600 /home/buildmachine/.ssh/authorized_keys  
sudo chown buildmachine /home/buildmachine/.ssh/authorized_keys  
```


sudo chmod go-w /home/buildmachine /home/buildmachine/.ssh 
sudo systemctl restart ssh.service

on the ssh client machine:
chmod 600 ~/.ssh/id_rsa;