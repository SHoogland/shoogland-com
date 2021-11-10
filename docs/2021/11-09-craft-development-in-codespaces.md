---
description: Craft development in github codespaces
date: 2021-11-09T12:00:00+0000

meta:
  - name: keywords
    content: 2021 docker craftcms codespaces devcontainer cloud development

feed:
  enable: true
---

# Craftcms development in the cloud
I like [craftcms](https://craftcms.com/) and I like [GitHub codespaces](https://github.com/features/codespaces), they go quite well together. Lets set up a basic example. I'll go through the steps and explain the important bits. 

Here is the full example: [Craft-codespace](https://github.com/SHoogland/craft-codespace)

I'll go through the following bits:
- [Getting started](#getting-started)
- [Codespace workspace container](#codespace-workspace-container)
- [Docker-compose file](#docker-compose-file)
- [Craft configuration](#craft-configuration)
- [Devcontainer](#devcontainer)
- [Launching the codespace](#launching-the-codespace)
- [Conclusion](#conclusion)

## Getting started
I started with a clean craft install:

```bash
composer create-project craftcms/craft my/project/path
```

As soon as it finishes the project files I skipped out of the install, as this example is not about running it locally, I just want the starter files of a craft project.

<image-element source="2021/craft-install" width="740" height="449" alt="Terminal window with the craft cms install" type="png" />

## Codespace workspace container
The codespace terminal runs in a container, or at least that is what I understand about it. To control this container, and subsequently the rest of the docker environment from within that container we set up the following config:

```yml
  workspace:
    image: mcr.microsoft.com/vscode/devcontainers/universal:1-focal
    init: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - workspace:/workspace
```

The image is a default devcontainer from microsoft, as far as I know default codespaces ship with this.

`init: true` makes sure this container is tightly linked to the host machine, this is required to launch the codespace to run with this container

Binding the docker.sock to the container links the docker cli to the host machine, so if we run docker or docker-compose it communicates with the docker engine running on the host.

And finally the workspace mount, I will get back to this a little later, but it takes care of sharing our project files between different containers.

## Docker-compose file
With the workspace container covered, we add the following containers to complete the environment:
- mariadb (the database)
- composer (running composer in a consistent environment)
- console (running the craft queue)
- craft (the php-fpm process + nginx that serves our craft application)

Combining everything together results in this docker-compose file:

```yml
version: '3'
services:
  composer:
    image: composer
    volumes:
      - workspace:/app

  craft:
    image: craftcms/nginx:8.0-dev
    ports:
      - '8080:8080'
    volumes:
      - workspace:/app
    deploy:
      resources:
        limits:
          memory: 1024M
    environment:
      CODESPACES: ${CODESPACES}
      CODESPACE_NAME: ${CODESPACE_NAME}
    logging:
      options:
        max-size: "1m"
        max-file: "3"
    depends_on:
      - mariadb

  mariadb:
    image: mariadb
    ports:
      - '3306:3306'
    volumes:
      - dbdata:/var/lib/mysql:delegated
    environment:
      MYSQL_DATABASE: craft
      MYSQL_USER: craft
      MYSQL_PASSWORD: craft
      MYSQL_ROOT_PASSWORD: root
    deploy:
      resources:
        limits:
          memory: 512M
    logging:
      options:
        max-size: "1m"
        max-file: "3"

  console:
    image: craftcms/cli:8.0-dev
    volumes:
      - workspace:/app
    command: sh -c 'sleep 10 && php craft queue/listen --verbose=1 --interactive=0 --isolate=1'
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1024M
    logging:
      options:
        max-size: "1m"
        max-file: "3"
    depends_on:
      - mariadb

  workspace:
    image: mcr.microsoft.com/vscode/devcontainers/universal:1-focal
    init: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - workspace:/workspace

volumes:
  dbdata:
    driver: local

  workspace:
    driver: local
    driver_opts:
      type: none
      device: /var/lib/docker/codespacemount/workspace/craft-codespace
      o: bind
```

As you can see, the workspace volume is mounted to the workspace, craft and console containers. This is to ensure our file changes we make in the codespace editor are shared with the running craft containers.

## Craft configuration

I tweaked some basic configuration to have craft run a little smoother. Starting in the general.php

```php
<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\helpers\App;

$isDev = App::env('ENVIRONMENT') === 'dev';
$isProd = App::env('ENVIRONMENT') === 'production';

// Recognize if we are running in a codespace and under which name
// this is why we forward the CODESPACES ENV vars in our docker-compose file to the container
$isCodespaces = App::env('CODESPACES');
$codespaceName = App::env('CODESPACE_NAME');

$localhostAlias = 'http://localhost:8080';

if ($isCodespaces) {
    $localhostAlias = 'https://' . $codespaceName . '-8080.githubpreview.dev';
}

return [
    // default craft config:
    'defaultWeekStartDay' => 1,
    'omitScriptNameInUrls' => true,
    'cpTrigger' => App::env('CP_TRIGGER') ?: 'admin',
    'securityKey' => App::env('SECURITY_KEY'),
    'devMode' => $isDev,
    'allowAdminChanges' => $isDev,
    'disallowRobots' => !$isProd,

    // custom additions:
    // I don't like usernames, in my experience they are often redundant
    'useEmailAsUsername' => true,

    // We use the @siteUrl alias in the default project, so we can tell craft its baseurl
    'aliases' => [
        '@webroot' => dirname(__DIR__) . '/web',
        '@siteUrl' => $localhostAlias . '/',
    ],
];
```

Every craft project needs a .env file here is our example:
```bash
# The environment Craft is currently running in (dev, staging, production, etc.)
ENVIRONMENT=dev

# The application ID used to to uniquely store session and cache data, mutex locks, and more
APP_ID=CraftCMS--[generated-app-id]

# The secure key Craft will use for hashing and encrypting data
SECURITY_KEY=[generated-security-key]

# Database Configuration (connecting to the mariadb container)
DB_DRIVER=mysql
DB_SERVER=mariadb
DB_PORT=3306
DB_DATABASE=craft
DB_USER=craft
DB_PASSWORD=craft
DB_SCHEMA=
DB_TABLE_PREFIX=

# The URI segment that tells Craft to load the control panel
CP_TRIGGER=admin
```
I used crafts setup commands to generate the app id and security key.

## Devcontainer
To alter the codespace "devcontainer" you need a .devcontainer file, here we can specify how we want our codespace to function and what to include on startup

```json
{
  "name": "Craft Codespace",
  "dockerComposeFile": "../docker-compose.yml", // tell the codespace to use a docker-compose file
  "service": "workspace", // defines the container to initialize as terminal
  "runServices": [
    "mariadb", // start mariadb on start of the codespace
  ],
  "remoteUser": "codespace",
  "extensions": [ // some useful vscode extensions
    "GitHub.vscode-pull-request-github",
    "ms-azuretools.vscode-docker",
    "whatwedo.twig"
  ],
  "workspaceFolder": "/workspace", // define the work folder
	"portsAttributes": {
		"8080": { // define the port to be used
			"label": "Craft"
		}
	}
}
```

## Launching the codespace
Whith those steps in place we can start our GitHub codespace. After launch we need a few steps to get it fully functional:
- You start with a clean clone so we first need the vendor folder: ```docker-compose run --rm composer composer install```
- The database is empty as well, so lets fix that: ```docker-compose run --rm console php craft install/craft --email admin@craftcms.com --language en-GB --password password --site-name "Codespace demo" --site-url @siteUrl```
- Now we are ready to go: ```docker-compose up -d craft console```

And there we are, craft running in a cloud based development environment:

<image-element source="2021/welcome-craft" width="740" height="449" alt="Terminal window with the craft cms install" type="png" />

## Conclusion
I really like the idea of codespaces, ready to go, completely reproduceable dev environments in the cloud. No more individual mac or computer issues, and on top of that a bit quicker than our (mac and windows owners) local virtualised docker environment.

Thoughts? Did I mess something up? Please let me know!

<disqus />
