FROM nginx:stable

LABEL org.opencontainers.image.source https://github.com/SHoogland/shoogland-com

COPY docs/.vuepress/dist/ /usr/share/nginx/html

COPY config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
