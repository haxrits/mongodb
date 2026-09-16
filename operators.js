Mysql-

1. Databases
2. Tables
3. Rows

No-Sql-

1. Database
2. Collections
3. Documents
4. fields

 **> Embedded objects-**

**example—**

```java
// Insert one student document with an embedded object (address)
db.students.insertOne({
  name: "Aarav Sharma",
  age: 20,
  college: "Poornima Institute of Engineering & Technology",
  branch: "CSE",
  cgpa: 8.6,
  address: {
    houseNo: "12A",
    street: "Malviya Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: 302017
  }
});
```

```java

db.products.insertOne({
  name: "Perfume",
  price: 1000,
  rating: "3/5",
  deliveryDays: ["1","2","3"],
  specs: {
    brand: "ABC",
    type: "Eau de Parfum",
    quantityMl: 100,
    for: "Unisex"
  }
});
```

Microsoft Windows [Version 10.0.26200.9278]
(c) Microsoft Corporation. All rights reserved.

C:\Users\MK Kushwaha>mongosh --version
2.10.0

C:\Users\MK Kushwaha>mongosh "mongodb+srv://cluster0.hckfilg.mongodb.net/" --apiVersion 1 --username <db_username> --password ONeiM1UwLnXWBPhL
The system cannot find the file specified.

C:\Users\MK Kushwaha>mongosh "mongodb+srv://cluster0.hckfilg.mongodb.net/" --apiVersion 1 --username <db_username> --password ONeiM1UwLnXWBPhL
The system cannot find the file specified.

C:\Users\MK Kushwaha>mongosh
Current Mongosh Log ID: 6aa7ac8475c544f00e19b38d
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.10.0
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017

C:\Users\MK Kushwaha>mongosh "mongodb+srv://cluster0.hckfilg.mongodb.net/" --apiVersion 1 --username g43734331_db_user --password
Enter password: ****************
Current Mongosh Log ID: 6aa7acf6b2394ac163232adf
Connecting to:          mongodb+srv://<credentials>@cluster0.hckfilg.mongodb.net/?appName=mongosh+2.10.0
MongoServerSelectionError: E8040000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:openssl\ssl\record\rec_layer_s3.c:918:SSL alert number 80
. It looks like this is a MongoDB Atlas cluster. Please ensure that your Network Access List allows connections from your IP.

C:\Users\MK Kushwaha>mongosh "mongodb+srv://cluster0.hckfilg.mongodb.net/" --apiVersion 1 --username g43734331_db_user --password
Enter password: ****************
Current Mongosh Log ID: 6aa7adcc3adfdd6a67d03a4a
Connecting to:          mongodb+srv://<credentials>@cluster0.hckfilg.mongodb.net/?appName=mongosh+2.10.0
Using MongoDB:          8.0.32 (API Version 1)
Using Mongosh:          2.10.0

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

Atlas atlas-276ysu-shard-0 [primary] test> hello
ReferenceError: hello is not defined
Atlas atlas-276ysu-shard-0 [primary] test> show dbs
sample_mflix  136.61 MiB
admin                0 B
local                0 B
Atlas atlas-276ysu-shard-0 [primary] test> use collegeDB
switched to db collegeDB
Atlas atlas-276ysu-shard-0 [primary] collegeDB> db.createCollection("Students")
{ ok: 1 }
Atlas atlas-276ysu-shard-0 [primary] collegeDB> db.students.insertOne({
|   name: "Aarav Sharma",
|   age: 20,
|   college: "Poornima Institute of Engineering & Technology",
|   branch: "CSE",
|   cgpa: 8.6,
|   address: {
|     houseNo: "12A",
|     street: "Malviya Nagar",
|     city: "Jaipur",
|     state: "Rajasthan",
|     pincode: 302017
|   }
| });
{
acknowledged: true,
insertedId: ObjectId('6aa7b0653adfdd6a67d03a4b')
}