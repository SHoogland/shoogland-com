---
description: A guide for using a raspberrypi as a wireless access point
date: 2020-04-11T12:00:00+0000

meta:
  - name: keywords
    content: raspberrypi wireless accesspoint

feed:
  enable: true
---

# Raspberry Pi as a wireless access point

download pi raspbian img
2019-09-26-raspbian-buster-lite.img

use diskutils to unmount

check the disk id in disk utils (on my mac disk2)

write img to sd card
`sudo dd bs=1m if=2020-02-13-raspbian-buster-lite.img of=/dev/rdisk2 conv=sync`

add empty file with the name ssh to the sd card root (aka boot dir) to enable ssh

eject sd card

log into the pi over ssh (pi@ip with pw raspberry)

change pw with passwd

sudo apt-get update
sudo apt-get upgrade

sudo reboot

sudo apt-get install hostapd bridge-utils

sudo systemctl unmask hostapd
sudo systemctl enable hostapd

sudo nano /etc/hostapd/hostapd.conf

```
interface=wlan0
bridge=br0
ssid=NameOfNetwork
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

sudo nano /etc/default/hostapd

add `/etc/hostapd/hostapd.conf` to DAEMON_CONF and uncomment

sudo reboot

add this point the pi boots with an visible access point for wifi clients

sudo nano /etc/network/interfaces

```
auto br0
iface br0 inet dhcp
bridge_ports eth0 wlan0
pre-up ifconfig eth0 0.0.0.0 up
pre-up ifconfig wlan0 0.0.0.0 up
pre-up brctl addbr br0
pre-up brctl addif br0 eth0
post-down ifconfig wlan0 0.0.0.0 down
post-down ifconfig eth0 0.0.0.0 down
post-down brctl delif br0 eth0
post-down brctl delbr br0
```

sudo reboot

the pi reboots and bridges the access point connections to the ethernet interface making wifi clients appear as ethernet clients on the network