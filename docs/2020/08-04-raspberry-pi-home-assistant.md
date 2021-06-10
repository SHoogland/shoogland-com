---
description: Setup a raspberry pi with home assistant on docker
date: 2020-08-04T12:00:00+0000

meta:
  - name: keywords
    content: 2020 raspberry pi docker home-assistant reverse-nginx-proxy

feed:
  enable: true
---

# Setup a raspberry pi with home assistant on docker

### Prerequisites
- know how on how to port forward on your router, so the domain name connects to your pi
- Forward port 80 (for certbot challenge) and port 443 (for the interface over ssl)

### Lets get started
Start with a clean pi: [setup raspberry pi](./04-13-raspberry-pi-setup.md)

install docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

install docker compose:
```bash
sudo apt-get install libffi-dev libssl-dev
sudo apt install python3-dev
sudo apt-get install -y python3 python3-pip
sudo pip3 install docker-compose
```

Add a docker-compose.yml
```yml
version: '3'
services:
  nginx-proxy:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-config/proxy.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    restart: always
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"
  certbot:
    image: certbot/certbot:arm32v6-latest
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
  homeassistant:
    container_name: home-assistant
    image: homeassistant/armhf-homeassistant:stable
    volumes:
      - ./home-assistant-config:/config
    environment:
      - TZ=Europe/Amsterdam
    restart: always
    network_mode: host
```

create some directories
```bash
mkdir nginx-config
mkdir home-assistant-config
mkdir certbot
mkdir certbot/conf
mkdir certbot/www
```

nginx-config/proxy.conf
```apacheconf
#server {
#	listen 443 ssl;
#	server_name [redacted_host_name];

#	location / {
#		proxy_pass http://[redacted_local_ip]:8123;
#		proxy_http_version 1.1;
#		proxy_set_header Upgrade $http_upgrade;
#		proxy_set_header Connection 'upgrade';
#		proxy_set_header X-Forwarded-For $remote_addr;
#		proxy_set_header Host $host;
#		proxy_cache_bypass $http_upgrade;

#	}

#	ssl_certificate /etc/letsencrypt/live/[redacted_host_name]/fullchain.pem;
#	ssl_certificate_key /etc/letsencrypt/live/[redacted_host_name]/privkey.pem;
#	include /etc/letsencrypt/options-ssl-nginx.conf;
#	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

#}

server {
    listen 80;
    server_name [redacted_host_name];

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }    
}
```

run: `sudo docker-compose up -d`

fetch certs
```bash
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email [redacted_email_address] \
    -d [redacted_host_name] \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot
```

If that succeeded uncomment the server part with listen 443 in proxy.conf

Inspired by: [https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)

### update home assistant

`sudo docker-compose pull`

`sudo docker-compose stop`

`sudo docker-compose up --force-recreate -d`

Profit!

<disqus />
