---
description: Leave clicking through cloud consoles to the past
date: 2021-02-04T12:00:00+0000

meta:
  - name: keywords
    content: 2021 terraform infrastructure docker traefik digitalocean

feed:
  enable: true
---

# Automating your infrastructure with terraform
With the start of this year I set out to finally figure out how to completely automate my infrastructure (sounds way better than my website). Managing droplets, ip addresses with dns, and certificates manually is only fun for the first few times, after that you want to automate it. That way you can repeat it as many times as you like with litteraly only a copy paste and a commit. At least, thats how I solved it with the following approach.

## The goal
I want to be able to spin up a droplet on digital ocean, add its ip to a dns provider, select a docker image to serve as a website (or anything else you can run with docker for that matter), provision a certificate so it works with https, and as a bonus have my ssh key so I can quickly ssh into it. While we're at it configure a firewall so only port 443 is open and I don't have to worry wheter my redis or mysql instances are publicly accesible.

## Terraform
Infrastructure as code, lovely concept, but for some reason just out of reach to work out of the box. Maybe people want to keep their production setups private or I haven't found the public ones yet. So there is room for more simple examples.

I started with this great write up of how to get started with terraform and a remote state:

[Terraform remote state setup by Kyler Middleton](https://medium.com/swlh/lets-do-devops-bootstrap-aws-to-your-terraform-ci-cd-azure-devops-github-actions-etc-b3cc5a636dce)

## Managing the cloud through git
Next I got my digital ocean api key and aws access credentials and added it to github action secrets of a fresh repository. Together with the following github action workflow, everything will now be run from the cloud, by the cloud (github).

```yaml
name: Apply

on:
  push:
    branches:
      - main

jobs:
  apply:
    runs-on: ubuntu-latest
    name: Terraform apply
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_DEFAULT_REGION: "eu-west-2"
      DIGITALOCEAN_TOKEN: ${{ secrets.DIGITALOCEAN_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Terraform init
        run: terraform init

      - name: Terraform apply
        run: terraform apply -auto-approve
```

To check what is going to happen before I merge to main, I have the following workflow on pull requests, and even setup branch protection to prevent me commiting straight to main.

```yaml
name: Plan

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  plan:
    runs-on: ubuntu-latest
    name: Terraform plan
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_DEFAULT_REGION: "eu-west-2"
      DIGITALOCEAN_TOKEN: ${{ secrets.DIGITALOCEAN_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Terraform init
        run: terraform init

      - name: Terraform plan
        run: terraform plan
```

## The website
Starting with the bootstrap module from the mentioned blogpost we have a main.tf file something like this

```hcl
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
    aws = {
      source = "hashicorp/aws"
    }
  }
  backend "s3" {
   bucket         = "[s3bucketname]"
   key            = "terraform.tfstate"
   region         = "eu-west-2"
   dynamodb_table = "aws-locks"
   encrypt        = true
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-west-2"
}

# the state persistence on aws
module "bootstrap" {
  source                      = "./modules/bootstrap"
  name_of_s3_bucket           = "[s3bucketname]"
  dynamo_db_table_name        = "aws-locks"
}
```

All we need to do now is add some resources:

```hcl
# a dns zone from aws
resource "aws_route53_zone" "shoogland_com" {
  name = "shoogland.com"
}

# an ssh key from a local file
resource "digitalocean_ssh_key" "mbp_sh" {
  name       = "Macbook - Stephan"
  public_key = file("ssh_keys/id_rsa.pub")
}

# a digital ocean droplet with a user-data file to provision the droplet
# I ran rancheros as everything is going to be in docker
# add your defined ssh key to be able to login to the droplet later
resource "digitalocean_droplet" "www_shoogland_com" {
  image      = "rancheros"
  name       = "www.shoogland.com"
  region     = "ams3"
  ipv6       = true
  size       = "s-1vcpu-1gb"
  tags       = ["webserver"]
  ssh_keys   = [digitalocean_ssh_key.mbp_sh.fingerprint]
  user_data  = file("user-data.sh")
}

# some dns records to point to the droplet
resource "aws_route53_record" "www_shoogland_com_a" {
  zone_id = aws_route53_zone.shoogland_com.dns_zone_id
  name    = "www.shoogland.com"
  type    = "A"
  ttl     = 900
  records = [ digitalocean_droplet.www_shoogland_com.ipv4_address ]
}

resource "aws_route53_record" "www_shoogland_com_aaaa" {
  zone_id = aws_route53_zone.shoogland_com.dns_zone_id
  name    = "www.shoogland.com"
  type    = "AAAA"
  ttl     = 900
  records = [ digitalocean_droplet.www_shoogland_com.ipv6_address ]
}

# And a firewall to secure the ports
resource "digitalocean_firewall" "www_shoogland_com" {
  name = "www_shoogland_com"

  droplet_ids = [digitalocean_droplet.www_shoogland_com.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "icmp"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
```

The user-data file contains the following startup code:

```bash
#cloud-config

write_files:
  - path: /etc/rc.local
    permissions: "0755"
    owner: root
    content: |
      #!/bin/bash
      wait-for-docker

      export traefik=traefik
      export shoogland=ghcr.io/shoogland/shoogland-com

      for image in $traefik $shoogland; do
        until docker inspect $image > /dev/null 2>&1; do
          docker pull $image
          sleep 2
        done
      done

      # traefik is great at managing certs, and routing traffic to your docker images
      # replace the [your-email] with something valid if you copy this
      docker run \
        -d \
        --name traefik \
        --restart=always \
        -p 80:80 \
        -p 443:443 \
        -v letsencrypt:/letsencrypt \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        traefik \
          --providers.docker=true \
          --providers.docker.exposedbydefault=false \
          --entrypoints.web.address=:80 \
          --entrypoints.websecure.address=:443 \
          --certificatesresolvers.myresolver.acme.httpchallenge=true \
          --certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web \
          --certificatesresolvers.myresolver.acme.email=[your-email] \
          --certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json

      sleep 2

      # running your image with a ton of labels tells traefik how to configure its routes
      docker run \
        -d \
        --name shoogland-com \
        --restart=always \
        --label traefik.enable=true \
        --label "traefik.http.routers.www-shoogland-com-http.rule=Host(\`www.shoogland.com\`)" \
        --label traefik.http.routers.www-shoogland-com-http.entrypoints=web \
        --label traefik.http.routers.www-shoogland-com-http.middlewares=www_redirect \
        --label "traefik.http.routers.www-shoogland-com-https.rule=Host(\`www.shoogland.com\`)" \
        --label traefik.http.routers.www-shoogland-com-https.entrypoints=websecure \
        --label traefik.http.routers.www-shoogland-com-https.tls=true \
        --label traefik.http.routers.www-shoogland-com-https.tls.certresolver=myresolver \
        --label "traefik.http.middlewares.www_redirect.redirectregex.regex=^https?:\/\/(www\.)?shoogland\.com\/?(.*)$" \
        --label "traefik.http.middlewares.www_redirect.redirectregex.replacement=https://www.shoogland.com/${2}" \
        --label "traefik.http.middlewares.www_redirect.redirectregex.permanent=true" \
        ghcr.io/shoogland/shoogland-com
```

Using my ghcr.io/shoogland/shoogland-com image as an example which exposes one port (80) as the website I want to run.

Commit this to your repository, wait a little bit while the action runs, the droplet gets provisioned, dns records are created, traefik provisions a certificate, and your good to go. Thats how I run this website at the time of writing (cant promise I won't figure out something new a week or month later).

<disqus />
