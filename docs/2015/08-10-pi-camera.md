---
description: Uploading pi camera images to aws
date: 2015-08-10T12:00:00+0000

meta:
  - name: keywords
    content: raspberry pi camera aws s3 bucket

feed:
  enable: true
---

# Raspberry PI Camera

### Disclaimer
I wrote this down in august of 2020, because I was cleaning up the raspberry pi we used for this project (I know, 5 years later). So this is more a reference to the pieces I could salvage then a how to.

### Details

We build the [timmerdorp.com](https://timmerdorp.com) site with a "live" header image during the Timmerdorp week.
So every minute or so, this code uploaded a new image to an s3 bucket, which then got shown on the homepage.

```sh
#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H%M")
DAY=$(date +"%Y-%m-%d")

raspistill -vf -hf -h 1080 -w 1920 -q 10 -e jpg -th none -o /home/pi/usbdrv/$DATE.jpg

/usr/local/bin/aws s3 cp /home/pi/usbdrv/$DATE.jpg s3://raspberrycam/$DAY/ --acl public-read

# I believe we posted the $date to a database (parse server then) as well, so we could retrieve the specific image.

if [ $? -eq 0 ]; then
   rm /home/pi/usbdrv/$DATE.jpg
else
   echo FAIL
fi
```

<disqus />
