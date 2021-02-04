---
description: Clone a mongodb from one server/cluster to another
date: 2020-11-03T12:00:00+0000

meta:
  - name: keywords
    content: 2020 mongo mongodb clone database server cluster

feed:
  enable: true
---

# Clone a mongodb database from server to server

```bash
mongodump 
    --host <source-host:port> 
    --ssl 
    --username <username> 
    --password <password> 
    --authenticationDatabase admin 
    --db <sourceDbName> 
```

```bash
mongorestore 
    --host <target-host:port> 
    --ssl 
    --username <username> 
    --password <password> 
    --authenticationDatabase admin 
    --db <targetDbName>
    <dump folder/file>
```

`mongodb+srv://<user>:<pw>@<host>/<db-name>?retryWrites=true&w=majority`

```
mongodump \
    --host <host>:<port> \
    --ssl \
    --username <user> \
    --password <pw> \
    --db <db-name>
```

```
mongorestore \
    --host <host> \
    --ssl \
    --username <user> \
    --password <pw> \
    --db <db-name> \
    dump
```


```
mongodump --host --host <host>:<port> \
          --ssl \
          --username <user> \
          --password <pw> \
          --db <db-name>
```

`mongorestore --uri mongodb+srv://<user>:<pw>@<host>`

```
mongorestore --host <clusterName>/<shard-host>:<port>,<shard-host>:<port>,<shard-host>:<port> \
             --ssl \
             --username <user> \
             --password <pw> \
             --authenticationDatabase admin \
             --nsExclude 'admin.system.*'
```
