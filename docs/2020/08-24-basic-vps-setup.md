
## ubuntu 20

apt-get update
apt-get upgrade
shutdown -r now

adduser --disabled-password --gecos "" production
mkdir /var/www
mkdir /var/www/production

chown -R www-data:www-data /var/www/production
mkdir -p /home/production/websites
chown -Rf production:production /home/production/websites
chmod -Rf 770 /home/production/websites

su production
cd
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
exit

curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh 
usermod -aG docker production

apt-get install -y libffi-dev libssl-dev
apt-get install -y python3-dev
apt-get install -y python3 python3-pip
pip3 install docker-compose

su production

mkdir /home/production/websites
mkdir /home/production/websites/[project]
mkdir /home/production/websites/[project]/dist
nano /home/production/websites/[project]/dist/index.php
mkdir /home/production/websites/[project]/dhparam

exit
openssl dhparam -out /home/production/websites/[project]/dhparam/dhparam-2048.pem 2048
su production

/home/production/websites/[project]/docker-compose.yml
```yaml
version: '3'

volumes:
  mariadb_data:
  redis_data:

services:
  app:
    build:
      context: ./
      dockerfile: ./docker/app/Dockerfile
      ports:
      - '9000:9000'
    volumes:
      - ./dist/:/var/www:delegated
      - ./docker/app/local.ini:/usr/local/etc/php/conf.d/local.ini
      - ./docker/app/php-fpm/www2.conf:/usr/local/etc/php-fpm.d/www2.conf
    environment:
      LANG: C.UTF-8
    restart: always

  mariadb:
    image: mariadb
    ports:
      - '3306:3306'
    volumes:
      - mariadb_data:/var/lib/mysql:cached
      - ./docker/mariadb/my.cnf:/etc/mysql/my.cnf
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: wordpress
    restart: always

  redis:
    image: redis:4-alpine
    ports:
      - '6379:6379'
    command: redis-server --requirepass wordpress
    volumes:
      - redis_data:/var/lib/redis:cached

  # nuxt:
  #   image: node:12-alpine
  #   working_dir: /var/www
  #   volumes:
  #     - ./:/var/www:delegated
  #   expose:
  #     - 3000
  #   command: sh -c 'npm i && npm start --host=0.0.0.0'
```

mkdir /home/production/websites/[project]/docker
mkdir /home/production/websites/[project]/docker/web
mkdir /home/production/websites/[project]/docker/web/conf.d

/home/production/websites/[project]/docker/web/conf.d/app.conf
```conf
map $sent_http_content_type $expires {
    default                    off;
    text/html                  epoch;
    text/css                   max;
    application/javascript     max;
    ~image/                    max;
}

server {
	listen 80;
	listen [::]:80;
	server_name [[domain]];

	location ~ /.well-known/acme-challenge {
		allow all;
		root /var/www;
	}

	location / {
			rewrite ^ https://$host$request_uri? permanent;
	}
}

server {
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	server_name [[domain]];

	server_tokens off;

	ssl_certificate /etc/letsencrypt/live/[[domain]]/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/[[domain]]/privkey.pem;

	ssl_buffer_size 8k;

	ssl_dhparam /etc/ssl/certs/dhparam-2048.pem;

	ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
	ssl_prefer_server_ciphers on;

	ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

	ssl_ecdh_curve secp384r1;
	ssl_session_tickets off;

	ssl_stapling on;
	ssl_stapling_verify on;
	resolver 8.8.8.8;

    index index.php index.html;
    error_log  /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    root /var/www;
    index index.php index.html index.htm;

    client_max_body_size 128M;

    proxy_connect_timeout       600;
    proxy_send_timeout          600;
    proxy_read_timeout          600;
    send_timeout                600;

    expires $expires;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

    location ~ \.php$ {
        try_files $uri /index.php?$query_string;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_read_timeout 600;
    }

#    location ~ (/js/.*bundle.js(.map)?|/js/.*hot-update.[js|json]|/sockjs-node.*) {
#        proxy_pass http://webpack:8080;
#        proxy_http_version 1.1;
#        proxy_set_header Upgrade $http_upgrade;
#        proxy_set_header Connection 'upgrade';
#        proxy_set_header Host $host;
#        proxy_cache_bypass $http_upgrade;
#    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
        gzip_static on;
    }
}
```

mkdir /home/production/websites/[project]/docker/mariadb

/home/production/websites/[project]/docker/mariadb/my.cnf
```conf
[mysqld]
general_log = 1
general_log_file = /var/lib/mysql/general.log
```

mkdir /home/production/websites/[project]/docker/app

/home/production/websites/[project]/docker/app/Dockerfile
```Dockerfile
FROM php:7.2-fpm-alpine

# Copy composer.lock and composer.json
# COPY composer.lock composer.json /var/www/

# Set working dir
WORKDIR /var/www

RUN apk add --no-cache bash zlib-dev libpng-dev php-intl

RUN set -xe \
    && apk add --update \
        icu \
    && apk add --no-cache --virtual .php-deps \
        make \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        zlib-dev \
        icu-dev \
        g++ \
    && docker-php-ext-configure intl \
    && docker-php-ext-install \
        intl \
    && docker-php-ext-enable intl \
    && { find /usr/local/lib -type f -print0 | xargs -0r strip --strip-all -p 2>/dev/null || true; } \
    && apk del .build-deps \
    && rm -rf /tmp/* /usr/local/lib/php/doc/* /var/cache/apk/*

RUN docker-php-ext-install \
    mysqli \
    pdo \
    zip \
    pdo_mysql \
    gd \
    iconv \
    bcmath \
    exif

RUN set -ex \
    && apk add --no-cache --virtual .phpize-deps $PHPIZE_DEPS imagemagick-dev libtool \
    && export CFLAGS="$PHP_CFLAGS" CPPFLAGS="$PHP_CPPFLAGS" LDFLAGS="$PHP_LDFLAGS" \
    && pecl install imagick-3.4.3 \
    && docker-php-ext-enable imagick \
    && apk add --no-cache --virtual .imagick-runtime-deps imagemagick \
    && apk del .phpize-deps

RUN mkdir /app \
    && mkdir /app/storage \
    && chmod +x /app/storage

RUN apk --update add wget curl git mysql-client sshpass nano

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

COPY . .

EXPOSE 9000
CMD ["php-fpm"]
```

/home/production/websites/[project]/docker/app/local.ini
```ini
upload_max_filesize=128M
post_max_size=128M
memory_limit=512M
max_execution_time=600
max_input_vars=10000
```

mkdir /home/production/websites/[project]/docker/app/php-fpm

/home/production/websites/[project]/docker/app/php-fpm/www2.conf
```conf
pm.max_children = 4
pm.max_spare_servers = 4
```

`comment out the server block with listen 443 in `

docker-compose up
