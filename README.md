# DB.js

## API

Methods acting on multiple records (as opposed to a single record, like `#find`) support method chaining and will only be lazily evaluated until `#valueOf()` is called.

Otherwise, to maintain consistency, call `#valueOf()` on `#find`.

```javascript
// Initialize or fetch a collection
DB.collection('people');

// Configure the primary key
DB.collection('people').configure(function(options) {
  options.pkey = 'id';
});

// Set the collection's data
let poeple = [{ id: 1, name: "Kash", color: "red" }, { id: 2, name: "Sanjna", color: "red" }]
DB.collection('people').set(people);

// Find a record by primary key
// returns { id: 1 name: "Kash", color: "red" }
DB.collection('people').find(1).valueOf();

// Find a record by property value
// returns [{ id: 2, name: "Sanjna", color: "red" }]
DB.collection('people').findBy({ name: "Sanjna" }).valueOf();

// Run a where-like query
// returns [{ id: 1, name: "Kash", color: "red" }, { id: 2, name: "Sanjna", color: "red" }]
DB.collection('people').where({ color: "red" }).valueOf();
// The #whereNot method is also available, where records that match the predicate are filtered out

// Save a new or already-persisted record (based on the primary key). This overwrites the previous record.
DB.collection('people').save({ id: 1, name: "Kash", color: "navy" });

// Update an already-persisted record or save it as a new record. This only overwrites the specified properties.
DB.collection('people').update({ id: 2, color: "yellow" });

// Get all records
DB.collection('people').all().valueOf();

// Get the number of records
DB.collection('people').count().valueOf();
```
