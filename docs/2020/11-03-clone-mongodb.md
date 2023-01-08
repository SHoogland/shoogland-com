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

`mongodb+srv://user:pw@timmerdorp.ddksu.mongodb.net/?retryWrites=true&w=majority`

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

sashido example from database connection string

mongodb://[user]:[pw]@[host]:[port]/[db-name]?replicaSet=pgrs2&ssl=true

```
mongodump --host <host>:<port> \
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

// sashido export
mongodump --uri "mongodb://user:pw@scalabledbs.cloudstrap.io:27002,scalabledbs.cloudstrap.io:27002,scalabledbs.cloudstrap.io:27002/pg-app-1-eu?replicaSet=pgrs2&ssl=true" \
          --archive


// mongodb atlas restore
mongorestore \
    --uri "mongodb+srv://user:pw@timmerdorp.ddksu.mongodb.net/?retryWrites=true&w=majority" \
    --ssl \
    --nsExclude "admin.system.*"
    --db timmerdorp \
    dump
