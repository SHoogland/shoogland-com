# Raspberry Pi Temperature
Code to upload the measured temp on a raspberry pi to firebase

[Repo](https://github.com/SHoogland/pi-temperature)

resources: 
- https://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/
- https://www.youtube.com/watch?v=aEnS0-Jy2vE

download pi raspbian img
2020-02-13-raspbian-buster-lite.img

use diskutils to unmount

check the disk id in disk utils (on my mac disk2)

write img to sd card
`sudo dd bs=1m if=2020-02-13-raspbian-buster-lite.img of=/dev/rdisk2 conv=sync`

add empty file with the name ssh to the sd card root (aka boot dir) to enable ssh

eject sd card

log into the pi over ssh (pi@ip with pw raspberry)

change pw with passwd

`sudo apt-get update`

`sudo apt-get upgrade`

`sudo apt-get install git`

`sudo reboot`

`sudo nano /boot/config.txt`

add `dtoverlay=w1-gpio`

`sudo reboot`

`sudo modprobe w1-gpio`

`sudo modprobe w1-therm`

`cd /sys/bus/w1/devices/`

`ls`

`cd 28-00000bcf3122`

`cat w1_slave`

# upload code
run with crontab for example 

- run with: `node index.mjs --experimental-modules [domain] [location] [sensor-address]`
