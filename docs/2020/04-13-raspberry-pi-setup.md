---
description: Default raspberry pi setup
date: 2020-04-13T12:00:00+0000

meta:
  - name: keywords
    content: 2020 articles blogposts raspberrypi

feed:
  enable: true
---

# RaspberryPi Default Setup
Before I do anything with a raspberry pi, I prepare it with the following steps:

- download pi raspbian img 2020-02-13-raspbian-buster-lite.img [raspbian downloads](https://www.raspberrypi.org/downloads/raspbian/)
- check the disk id in disk utils (on my mac disk2): `diskutil list`
- unmount the sd card `diskutil unmountDisk /dev/disk2`
- write img to sd card `sudo dd bs=1m if=2020-02-13-raspbian-buster-lite.img of=/dev/rdisk2 conv=sync`
- add empty file with the name `ssh` to the sd card root (aka boot dir) to enable ssh
- add `wpa_supplicant.conf` file with the wifi settings to enable wifi

```apacheconf
country=NL # Your 2-digit country code
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="[ssid]"
    psk="[pw]"
    key_mgmt=WPA-PSK
}
```

- eject sd card `diskutil eject /dev/disk2`
- log into the pi over ssh (`ssh pi@[ip]` with pw raspberry)
- change pw with `passwd`

Change hostname
- `sudo nano /etc/hostname`
- `sudo nano /etc/hosts`

Update
- `sudo apt-get update`
- `sudo apt-get upgrade`

Reboot
- `sudo reboot`
