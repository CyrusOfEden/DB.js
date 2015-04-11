# DB.js

## API

Methods acting on multiple records (as opposed to a single record, like `#find`) support method chaining and will only be lazily evaluated until `#valueOf()` is called.

Otherwise, to maintain consistency, call `#valueOf()` on `#find`.

```javascript
// Initialize or fetch a collection.
// Collections inherit from EventEmitter, so all EventEmitter methods will work.
DB.collection('people');

// Configure the primary key
DB.collection('people').configure((options) => {
  options.pkey = 'id';
});

// Set the collection's data
let people = [
  { id: 1, name: "Kash", color: "red" },
  { id: 2, name: "Sanjna", color: "red" }
];
DB.collection('people').set(people);

// Find a record by primary key
// returns { id: 1 name: "Kash", color: "red" }
DB.collection('people').find(1).valueOf();

// Find a record by property value
// returns [{ id: 2, name: "Sanjna", color: "red" }]
DB.collection('people').findBy({ name: "Sanjna" }).valueOf();

// Run a where-like query
// returns [
//   { id: 1, name: "Kash", color: "red" },
//   { id: 2, name: "Sanjna", color: "red" }
// ]
DB.collection('people').where({ color: "red" }).valueOf();
// The #whereNot method is also available, where records that
// match the predicate are filtered out.

// Add a record. Will fail (and return undefined) if a record with
// the same primary key already exists.
DB.collection('people').add({ id: 1, name: "Saily", color: "purple" });
// The above will fail since a record with id 1 already exists.

// Update an already-persisted record or save it as a new record.
// This only overwrites the specified properties. Aliased as `#save()`
DB.collection('people').update({ id: 2, color: "yellow" });

// Remove a record
DB.collection('people').remove({ id: 2 });

// Remove a record by primary key
DB.collection('people').destroy(1);

// Get all records
DB.collection('people').all().valueOf();

// Get the number of records
DB.collection('people').count().valueOf();
```
