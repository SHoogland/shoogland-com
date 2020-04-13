---
description: A log of the steps taken to set up an elk stack on digital ocean
date: 2020-04-10T12:00:00+0000

meta:
  - name: keywords
    content: elasticsearch kibana elkstack

feed:
  enable: true
---

# The ELK stack

https://www.digitalocean.com/community/tutorials/how-to-install-elasticsearch-logstash-and-kibana-elastic-stack-on-ubuntu-18-04

digital ocean droplet with ubuntue 18.04

monitoring, ipv6, private network and user-data enabled

user-data
```
#!/bin/bash

#
# install script (user-data) for ubuntu 18.04 droplet on digital ocean
#

apt-get -y update

ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

adduser --disabled-password --gecos "" production 

apt-get install -y bindfs

#
# installing certbot
#

apt-get update
apt-get install -y software-properties-common
add-apt-repository -y ppa:certbot/certbot
apt-get update
apt-get install -y python-certbot-nginx
```

install java
- `apt-get install openjdk-8-jdk`
- `java -version`
- `update-alternatives --config java`
- add the jdk folder without /bin/java from the previous command as JAVA_HOME="" in the next command
- `nano /etc/environment`
- `source /etc/environment`
- `echo $JAVA_HOME`


install elasticsearch
(https://tecadmin.net/setup-elasticsearch-on-ubuntu/)
- `apt-get install apt-transport-https`
- `wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`
- `add-apt-repository "deb https://artifacts.elastic.co/packages/7.x/apt stable main"`
- `apt-get update`
- `apt-get install elasticsearch`
- `nano /etc/elasticsearch/elasticsearch.yml`

back to the digital ocean tutorial
- `change network.host to localhost`
- `systemctl start elasticsearch`
- `systemctl enable elasticsearch`
- `curl -X GET "localhost:9200"`

kibana
- `apt-get install kibana`
- `systemctl enable kibana`
- `systemctl start kibana`

nginx
- `apt-get install nginx`

- `echo "kibanaadmin:`openssl passwd -apr1`" | tee -a /etc/nginx/htpasswd.users`
- enter a password for kibanaadmin

- `nano /etc/nginx/sites-available/elk.matise.nl`

```
server {
    listen 80;

    server_name elk.matise.nl;

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/htpasswd.users;

    location / {
        proxy_pass http://localhost:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- `ln -s /etc/nginx/sites-available/elk.matise.nl /etc/nginx/sites-enabled/elk.matise.nl`

- for some reason apache2 was running on my droplet
- `systemctl stop apache2`
- `systemctl disable apache2`
- `systemctl restart nginx`
- go to http://elk.matise.nl/status and see if it works

- `certbot --nginx`

logstash
- `apt-get install logstash`
- logstash could not start because I was using a 2gb memory server, resizing to 4gb fixed this.

- `nano /etc/logstash/conf.d/02-beats-input.conf`
```
input {
  beats {
    port => 5044
  }
}
```
- `nano /etc/logstash/conf.d/10-syslog-filter.conf`
```
filter {
  if [fileset][module] == "system" {
    if [fileset][name] == "auth" {
      grok {
        match => { "message" => ["%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: %{DATA:[system][auth][ssh][event]} %{DATA:[system][auth][ssh][method]} for (invalid user )?%{DATA:[system][auth][user]} from %{IPORHOST:[system][auth][ssh][ip]} port %{NUMBER:[system][auth][ssh][port]} ssh2(: %{GREEDYDATA:[system][auth][ssh][signature]})?",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: %{DATA:[system][auth][ssh][event]} user %{DATA:[system][auth][user]} from %{IPORHOST:[system][auth][ssh][ip]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sshd(?:\[%{POSINT:[system][auth][pid]}\])?: Did not receive identification string from %{IPORHOST:[system][auth][ssh][dropped_ip]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} sudo(?:\[%{POSINT:[system][auth][pid]}\])?: \s*%{DATA:[system][auth][user]} :( %{DATA:[system][auth][sudo][error]} ;)? TTY=%{DATA:[system][auth][sudo][tty]} ; PWD=%{DATA:[system][auth][sudo][pwd]} ; USER=%{DATA:[system][auth][sudo][user]} ; COMMAND=%{GREEDYDATA:[system][auth][sudo][command]}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} groupadd(?:\[%{POSINT:[system][auth][pid]}\])?: new group: name=%{DATA:system.auth.groupadd.name}, GID=%{NUMBER:system.auth.groupadd.gid}",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} useradd(?:\[%{POSINT:[system][auth][pid]}\])?: new user: name=%{DATA:[system][auth][user][add][name]}, UID=%{NUMBER:[system][auth][user][add][uid]}, GID=%{NUMBER:[system][auth][user][add][gid]}, home=%{DATA:[system][auth][user][add][home]}, shell=%{DATA:[system][auth][user][add][shell]}$",
                  "%{SYSLOGTIMESTAMP:[system][auth][timestamp]} %{SYSLOGHOST:[system][auth][hostname]} %{DATA:[system][auth][program]}(?:\[%{POSINT:[system][auth][pid]}\])?: %{GREEDYMULTILINE:[system][auth][message]}"] }
        pattern_definitions => {
          "GREEDYMULTILINE"=> "(.|\n)*"
        }
        remove_field => "message"
      }
      date {
        match => [ "[system][auth][timestamp]", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
      }
      geoip {
        source => "[system][auth][ssh][ip]"
        target => "[system][auth][ssh][geoip]"
      }
    }
    else if [fileset][name] == "syslog" {
      grok {
        match => { "message" => ["%{SYSLOGTIMESTAMP:[system][syslog][timestamp]} %{SYSLOGHOST:[system][syslog][hostname]} %{DATA:[system][syslog][program]}(?:\[%{POSINT:[system][syslog][pid]}\])?: %{GREEDYMULTILINE:[system][syslog][message]}"] }
        pattern_definitions => { "GREEDYMULTILINE" => "(.|\n)*" }
        remove_field => "message"
      }
      date {
        match => [ "[system][syslog][timestamp]", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
      }
    }
  }
}
```
- `nano /etc/logstash/conf.d/30-elasticsearch-output.conf`
```
output {
  elasticsearch {
    hosts => ["localhost:9200"]
    manage_template => false
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
  }
}
```
- test config:
- `sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t`

- `systemctl start logstash`
- `systemctl enable logstash`

filebeat
- `apt-get install filebeat`
- `nano /etc/filebeat/filebeat.yml`
- comment out elasticsearch:
```
...
#output.elasticsearch:
  # Array of hosts to connect to.
  #hosts: ["localhost:9200"]
...
```
- enable logstash
```
output.logstash:
  # The Logstash hosts
  hosts: ["localhost:5044"]
```
- `filebeat modules enable system`
- `filebeat modules list`
- `filebeat setup --template -E output.logstash.enabled=false -E 'output.elasticsearch.hosts=["localhost:9200"]'`
- `filebeat setup -e -E output.logstash.enabled=false -E output.elasticsearch.hosts=['localhost:9200'] -E setup.kibana.host=localhost:5601`
- `systemctl start filebeat`
- `systemctl enable filebeat`


configure external metricbeats
- `nano /etc/elasticsearch/elasticsearch.yml`
- set network host to : network.host: 0.0.0.0
- enable discovery.seed_hosts and set to: []
- `systemctl restart elasticsearch`

- `ufw allow from 206.189.106.24/32 to any port 9200`

ufw allow from 157.245.64.166/32 to any port 9200
- `apt-get install metricbeat`

- `metricbeat setup --template -E 'output.elasticsearch.hosts=["localhost:9200"]'`
- `metricbeat setup -e -E output.elasticsearch.hosts=['localhost:9200'] -E setup.kibana.host=localhost:5601`
- `systemctl start metricbeat`
- `systemctl enable metricbeat`


https://www.digitalocean.com/community/tutorials/how-to-gather-infrastructure-metrics-with-metricbeat-on-ubuntu-18-04

on another host
- `apt-get install apt-transport-https`
- `wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`
- `add-apt-repository "deb https://artifacts.elastic.co/packages/7.x/apt stable main"`
- `apt-get update`
- `apt-get install metricbeat`
- change host output:
- `nano /etc/metricbeat/metricbeat.yml`
- I also set fields: env: to [client (matise/lenouveauchef)]-[server type (node/wordpress/varnish)]
- `systemctl start metricbeat`
- `systemctl enable metricbeat`


on another host filebeat setup
- `apt-get install apt-transport-https`
- `wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`
- `add-apt-repository "deb https://artifacts.elastic.co/packages/7.x/apt stable main"`
- `apt-get update`
- `apt-get install filebeat`
- `filebeat modules enable apache`
- `filebeat modules list`
- change host output:
- `nano /etc/filebeat/filebeat.yml`
- `systemctl start filebeat`
- `systemctl enable filebeat`


# curator
- on the elk host machine
- `nano /etc/apt/sources.list.d/curator.list`
- add `deb [arch=amd64] https://packages.elastic.co/curator/5/debian stable main` to that file
- `apt-get update`
- `apt-get install elasticsearch-curator`
- `curator_cli delete_indices --filter_list '{"filtertype":"age","source":"creation_date","direction":"older","unit":"days","unit_count":45}'`

<disqus />
