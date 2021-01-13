FROM nginx:stable

COPY docs/.vuepress/dist/ /usr/share/nginx/html

COPY config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
