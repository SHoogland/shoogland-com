---
description: The timmerdorp ticket shop 2025 update
date: 2025-06-30T12:00:00+0000

meta:
  - name: keywords
    content: 2025 timmerdorp webshop tickets sale voluntary

feed:
  enable: true
---

# Timmerdorp webshop, 2025 update

## Introduction
This is a follow up on the [timmerdorp ticket shop post](https://www.shoogland.com/2024/07-02-timmerdorp-ticket-shop.html), where I described the history of the yearly  ticket sale and the issues we had. This year I want to share some of the improvements we made and how the sale went.

## 2025
Retry on kubernetes, some code improvements to prevent the issues from last year. I scaled up a little more aggresive than last year:
- added 2 8vcpu nodes to the cluster and scaled to 12 pods (6 parse and 6 nuxt) distributed over the 3 nodes
- added a dedicated redis (valkey) database
- scaled up the database to m80 (hosted on atlas)

This resulted in a more stable webshop, with no capacity related issues during the sale. 
There were however some small issues:
- The implemented ticket counter in redis worked mostly okay, but it seems some race conditions were still present, resulting in a few invalid available tickets during the release of expiring orders.
- The demand grew even further, 1200 users (whatever this exactly means, google analytics) tried to buy tickets at 10:00 am.

<image-element source="2025/timmerdorp-google-analytics" width="740" height="1000" alt="Google analytics" type="png" />
<image-element source="2025/grafana-request-metrics" width="740" height="425" alt="Grafana request metrics" type="png" />
