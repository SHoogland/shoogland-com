```sh
#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H%M")
DAY=$(date +"%Y-%m-%d")

raspistill -vf -hf -h 1080 -w 1920 -q 10 -e jpg -th none -o /home/pi/usbdrv/$DATE.jpg

/usr/local/bin/aws s3 cp /home/pi/usbdrv/$DATE.jpg s3://raspberrycam/$DAY/ --acl public-read

if [ $? -eq 0 ]; then
   rm /home/pi/usbdrv/$DATE.jpg
else
   echo FAIL
fi
```
