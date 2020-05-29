---
description: An example for e2e testing with wp-env, puppeteer and headless chrome on github actions
date: 2020-04-20T12:00:00+0000

meta:
  - name: keywords
    content: 2020 wp-env github-actions e2e

feed:
  enable: true
---

# e2e testing wordpress with wp-env on github actions

An example workflow file to run e2e test on github actions.

.github/workflows/run-wp.yml
```yaml
# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the master branch
on:
  push:
    branches: [ master ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      # get and output the composer cache directory
      - name: Get Composer Cache Directory
        id: composer-cache
        run: |
          echo "::set-output name=dir::$(composer config cache-files-dir)"

      # setup the composer cache (vendor) with github actions cache and the cache dir defined in the previous step
      - uses: actions/cache@v1
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-

      # run composer install
      - name: Composer Install
        uses: php-actions/composer@v1
        with:
          args: install

      # get the node version from the .nvmrc file
      - name: Read .nvmrc
        run: echo "##[set-output name=NVMRC;]$(cat .nvmrc)"
        id: nvm

      # setup node based on the version from the .nvmrc file, fetched in the previous step
      - name: Setup Node.js (.nvmrc)
        uses: actions/setup-node@v1
        with:
          node-version: "${{ steps.nvm.outputs.NVMRC }}"

      # setup the node cache (node_modules) with github actions cache
      - name: Cache Node - npm
        uses: actions/cache@v1
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-cache-

      # run the ci equivalent of npm install
      - name: npm ci
        run: |
          npm ci

      # run the wp-env setup command (wp-env start)
      - name: setup wp env
        run: |
          npm run wp-env

      # create a folder for the screenshots, this folder will be uploaded as artifact
      - run: mkdir screenshots

      # run the node.js puppeteer script (which takes the screenshots and controls chrome)
      - run: npm start

      # upload the screenshots as artifacts of this job
      - name: Upload screenshot
        uses: actions/upload-artifact@v1
        with:
          name: screenshots
          path: screenshots
```


index.js
```js
const puppeteer = require('puppeteer-core');

(async () => {
	const browser = await puppeteer.launch({executablePath: process.env.CHROME_BIN})
	const page = await browser.newPage()
	await page.goto('http://localhost:8888', {waitUntil: 'networkidle2'})
	await page.screenshot({path: 'screenshots/screenshot.png'});
	await page.goto('http://localhost:8888/wp-admin', {waitUntil: 'networkidle2'})
	await page.screenshot({path: 'screenshots/screenshot2.png'});
	await browser.close()
})()
```


.nvmrc
```
v12.13.0
```

npm init with these scripts and dependencies


package.json
```json
"scripts": {
  "start": "node index.js",
  "wp-env": "wp-env start"
}

"dependencies": {
  "@wordpress/env": "^1.2.0",
  "puppeteer-core": "^2.1.1"
}
```


.wp-env.json
```json
{
	"core": null,
	"plugins": [ "./plugins" ]
}
```


composer.json
```json
{
  "name": "stephan/wpenvtest",
  "description": "wpenvtest",
  "authors": [
    {
      "name": "Stephan Hoogland",
      "email": "stephan@shoogland.com"
    }
  ],
  "repositories": [
    {
      "type": "composer",
      "url": "https://wpackagist.org"
    }
  ],
  "require": {
    "wpackagist-plugin/mailgun": "*"
  },
  "extra": {
    "installer-paths": {
      "plugins/{$name}/": [
        "type:wordpress-plugin"
      ],
      "themes/{$name}/": [
        "type:wordpress-theme"
      ]
    }
  }
}
```

<disqus />
