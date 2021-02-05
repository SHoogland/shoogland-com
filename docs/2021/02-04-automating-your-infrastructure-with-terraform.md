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
Infrastructure as code, lovely concept, but for some reason just out of reach to work out of the box. Maybe people want to keep their production setups private or I haven't found the public ones yet.

So I started with this:

https://medium.com/swlh/lets-do-devops-bootstrap-aws-to-your-terraform-ci-cd-azure-devops-github-actions-etc-b3cc5a636dce

<disqus />
