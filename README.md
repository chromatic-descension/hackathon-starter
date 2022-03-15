
# Neural Art Style Transfer Server

Stuff about this.

## Mongo DB

Start the Mongo DB service: `sudo service mongod start`

Check the status of Mongo DB service: `sudo service mongod status`

Open Mongo shell: `mongo`

Open GUI for Mongo: `robo3t-snap`

### Basic shell commands

```sh
# Switch to the database
> use artDb
switched to db artDb

# Show collections
> show collections
contentImages
outputImages
styleImages

# Show contents of collection
> db.contentImages.find()
{ "_id" : ObjectId("613a5ae70f7e1b95cbf12e16"), "foo" : 444 }

# Create primary key
> db.contentImages.createIndex( { "fileName":1 }, { unique: true })
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
```

### Query shell commands 

See [query and projection operators](https://docs.mongodb.com/manual/reference/operator/query/#std-label-query-selectors).

```sh
# Find objects with foo > 2
> db.styleImages.find( {foo: {$gt:2} })
{ "_id" : ObjectId("613a5ab50f7e1b95cbf12e15"), "foo" : 123 }

# Remove objects with foo > 2
> db.styleImages.remove( {foo: {$gt:2} })
WriteResult({ "nRemoved" : 1 })

# Get object timestamp
> var doc = db.outputImages.findOne();
> doc._id.getTimestamp();
ISODate("2021-09-10T23:43:15Z")
```