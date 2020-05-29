---
description: Example apache proxy config
date: 2020-05-28T12:00:00+0000

meta:
  - name: keywords
    content: 2020 articles knowledgebase apache proxy

feed:
  enable: true
---

# An example apache configuration for an html proxy

A configuration file to set up a proxy in front of another webserver


```apacheconf
<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerAdmin serveradmin@domain.com
	ServerName proxy.domain.com
	DocumentRoot /var/www/path/to/site/folder/

	<Directory /var/www/path/to/site/folder>
		Options FollowSymLinks
		AllowOverride All

		SetEnv APPLICATION_ENV "dev_dev"

	</Directory>

	# optional basic auth
	RequestHeader set Authorization "Basic asdfasdfasdf"

	# disable encoding to allow html replace
	RequestHeader unset Accept-Encoding

	<Location "/">
		Order deny,allow
		Deny from all

		Allow from 123.123.123.123

		ProxyPass               https://original.domain.com/
		ProxyPassReverse        https://original.domain.com/
		ProxyHTMLEnable On
		ProxyHTMLExtended On

		ProxyHTMLLinks  source     src
		ProxyHTMLLinks  video      poster
		ProxyHTMLLinks  div        style
		ProxyHTMLLinks  section    style
		ProxyHTMLLinks  a          href
		ProxyHTMLLinks  area       href
		ProxyHTMLLinks  link       href
		ProxyHTMLLinks  img        src longdesc usemap
		ProxyHTMLLinks  object     classid codebase data usemap
		ProxyHTMLLinks  q          cite
		ProxyHTMLLinks  blockquote cite
		ProxyHTMLLinks  ins        cite
		ProxyHTMLLinks  del        cite
		ProxyHTMLLinks  form       action
		ProxyHTMLLinks  input      src usemap
		ProxyHTMLLinks  head       profile
		ProxyHTMLLinks  base       href
		ProxyHTMLLinks  script     src for

		# replace links in the html
		ProxyHTMLURLMap original.domain.com proxy.domain.com R
	</Location>

	SSLProxyEngine On
	SSLProxyVerify none
	SSLProxyCheckPeerCN off
	SSLProxyCheckPeerName off

	SSLCertificateFile /etc/letsencrypt/live/proxy.domain.com/fullchain.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/proxy.domain.com/privkey.pem
	Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

<disqus />
