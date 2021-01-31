FROM nginx:stable-alpine

LABEL "org.opencontainers.image.source"="https://github.com/SHoogland/shoogland-com"
LABEL "traefik.enable"="true"
LABEL "traefik.http.routers.www-shoogland-com-http.rule"="Host(`www.shoogland.com`)"
LABEL "traefik.http.routers.www-shoogland-com-http.entrypoints"="web"
LABEL "traefik.http.routers.www-shoogland-com-http.middlewares"="www_redirect"
LABEL "traefik.http.routers.www-shoogland-com-https.rule"="Host(`www.shoogland.com`)"
LABEL "traefik.http.routers.www-shoogland-com-https.entrypoints"="websecure"
LABEL "traefik.http.routers.www-shoogland-com-https.tls"="true"
LABEL "traefik.http.routers.www-shoogland-com-https.tls.certresolver"="myresolver"
LABEL "traefik.http.routers.shoogland-com-http.rule"="Host(`shoogland.com`)"
LABEL "traefik.http.routers.shoogland-com-http.entrypoints"="web"
LABEL "traefik.http.routers.shoogland-com-http.middlewares"="www_redirect"
LABEL "traefik.http.routers.shoogland-com-https.rule"="Host(`shoogland.com`)"
LABEL "traefik.http.routers.shoogland-com-https.entrypoints"="websecure"
LABEL "traefik.http.routers.shoogland-com-https.tls"="true"
LABEL "traefik.http.routers.shoogland-com-https.tls.certresolver"="myresolver"
LABEL "traefik.http.routers.shoogland-com-https.middlewares"="www_redirect"
LABEL "traefik.http.middlewares.www_redirect.redirectregex.regex"="^https?:\/\/(www\.)?shoogland\.com\/?(.*)$"
LABEL "traefik.http.middlewares.www_redirect.redirectregex.replacement"="https://www.shoogland.com/${2}"
LABEL "traefik.http.middlewares.www_redirect.redirectregex.permanent"="true"

COPY docs/.vuepress/dist/ /usr/share/nginx/html

COPY config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
