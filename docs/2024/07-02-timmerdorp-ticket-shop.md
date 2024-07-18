---
description: The history of the timmerdorp ticket shop
date: 2024-07-02T12:00:00+0000

meta:
  - name: keywords
    content: 2024 timmerdorp webshop tickets sale voluntary

feed:
  enable: true
---

# Timmerdorp webshop, a brief history

## Background
Every year the last week of the summer holiday, there is this big event: [Timmerdorp Heiloo](https://timmerdorp.com/). Up to 675 kids from the age of 7 to 12 gather for 4 days on a field with a huge pile of pallets and construct, improve, paint and finally destroy a wooden hut. The only tools they use: A hammer, nails and a saw. This has been a tradition for years (I believe this year (2024) is the 49th edition). I thought it would be fun to write down the technological evolution of the administration around selling and managing 675 tickets a year.

## Prologue
I think it started in 2015, we used to go from hut to hut on tuesday morning, to make a list of all the attendees, writing down their names and general location, so we had something to fall back to during an evacuation or some other incident (a parent at the gate).
But pen and paper is old fashioned and [Sil van Diepen](sil.mt) and I thought this could be done better in some kind of app. So we build a small database, which linked the children to a color (timmerdorp is split into 4 districts with each its own color) and a hut number. And made a simple web app to register the kids instead of writing it all down. This had the great benefit that we could search! Now when a parent showed up and needed to take their child to a dentist appointment for example we knew exactly where to find him/her.

At some point in the following years we discussed replacing the physical ticket sale by a digital one, that way we would have all the details up front and only had to link the kids to a hutnr. This would also simplify the sale, no long queue way too early in the morning on the day of the ticketsale.

## Before 2017
Up to and including timmerdorp heiloo 2016 we used to sell phisical tickets, there would be a huge line at 10:00 in the morning on some saturday. A lot of people would queue up hours before, just to get a great spot in line, so they can get their hands on these tickets.

## 2017
[Paydro](https://paydro.com/) expensive ticket shop solution, we paid almost 1200eu (1eu per ticket + payment method fee)

## 2018
Wordpress woocommerce tickets plugin
[Fooevents](https://www.fooevents.com/)

## 2019
Repeated the woocommerce shop

## 2020
Corona

## 2021
The new webshop, parse server
hosted on sashido
With the help of Stan van Baarsen, I build a completely new shop from scratch, no plugin or ticket service costs, just all we needed from a webshop catered to our needs.
mail issues

## 2022
sashido again
Some small improvements and a flawless sale, we started selling tickets at 10:00 and were sold out at around 17:00.

## 2023
digital ocean kubernetes + mongodb atlas
Problems: the demand was rising, a lot of people tried to buy tickets at 10:00 am sharp. The shop couldn't handle this, some double payments and mismatched tickets to orders occured.

## 2024
retry on kubernetes, some code improvements to prevent the issues from last year.
I set up grafana log aggregation
Still some issues, the ticket count failed, we sold more tickets than intended 616 instead of the 580 max I had configured.
A small bug where old payment links could be used for changed orders
And a crazy demand, a 1000 users (whatever this means, google) tried to buy tickets at 10:00 am.
<image-element source="2024/timmerdorp-google-analytics" width="740" height="1000" alt="Google analytics" type="png" />
<image-element source="2024/grafana-request-metrics" width="740" height="425" alt="Grafana request metrics" type="png" />
