---
description: Timmerdorp pi camera v2
date: 2022-09-11T12:00:00+0000

meta:
  - name: keywords
    content: 2022 raspberry pi timmerdorp camera timelapse

feed:
  enable: true
---

# Timmerdorp PI Camera 2022
This is an iteration on the 1st version from [2015](https://www.shoogland.com/2015/08-10-pi-camera.html)

This year I added contentful to host the latest image for the [Timmerdorp.com](https://timmerdorp.com) site. The header fetches the latest image from contentful every minute, so its a live updating background image.

### Requirements
- AWS account
- Contentful account
- raspberry pi 3b
- pi camera module

## Setup
- install nvm
- `nvm i 16`
- `sudo raspi-config` (to setup camera)
- `libcamera-jpeg -o test.jpg` (test camera)
- `sudo apt-get install python3-pip` (install python pip)
- `pip3 install awscli --upgrade --user` (install aws cli)
- `aws configure`
- create `package.json`
- create `image.sh`
- create `index.js`

## image script (image.sh)
```bash
#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H%M")
DAY=$(date +"%Y-%m-%d")


libcamera-jpeg -o /home/pi/images/$DATE.jpg --vflip --hflip

/home/pi/.local/bin/aws s3 cp /home/pi/images/$DATE.jpg s3://timmerdorp-media/2022/$DAY/ --acl public-read

/home/pi/.nvm/versions/node/v16.16.0/bin/node index.js $DATE.jpg

if [ $? -eq 0 ]; then
   rm /home/pi/images/$DATE.jpg
else
   echo FAIL
fi
```

## package.json
```json
{
  "dependencies": {
    "contentful-management": "^9.0.0"
  }
}
```

## Contentful script (index.js)
```js
const contentful = require('contentful-management')

const client = contentful.createClient({
	accessToken: '[accesstoken]'
})

const fs = require('fs')

async function uploadFile(name) {
	let space = await client.getSpace('[space-id]')
	let environment = await space.getEnvironment('master')
	let asset = await environment.createAssetFromFiles({
		fields: {
			title: {
				'nl': name
			},
			description: {
				'nl': name
			},
			file: {
				'nl': {
					contentType: 'image/jpg',
					fileName: name,
					file: fs.createReadStream('images/' + name)
				}
			}
		},
		metadata: {
			tags: [
				{
					sys: {
						type: "Link",
						linkType: "Tag",
						id: "headerPhotos"
					}
				}
			]
		}
	})
	asset = await asset.processForAllLocales()
	asset = await asset.publish()

	let assets = await environment.getAssets({
		'metadata.tags.sys.id[in]': 'headerPhotos',
		order: 'sys.createdAt'
	})

	if (assets.items.length > 10) {
		let deleteAmount = assets.items.length - 10;
		for (let i = 0; i < assets.items.length; i++) {
			const asset = assets.items[i];
			if (i < deleteAmount) {
				await asset.unpublish()
				await asset.delete()
			}
		}
	}

}

uploadFile(process.argv[2]);
```

## Crontab
Change/update the cron file with `crontab -e`
```
* * * * * /bin/bash /home/pi/image.sh >> /home/pi/images/log 2>&1
```

<disqus />
