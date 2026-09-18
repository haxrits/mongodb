C:\Users\MK Kushwaha>mongosh "mongodb+srv://vasanth970399_db_user:3mhM5ejjto8h6rhG@cluster0.u5gi0my.mongodb.net"
Current Mongosh Log ID: 6aaa05f906de2084c53bb0a1
Connecting to:          mongodb+srv://<credentials>@cluster0.u5gi0my.mongodb.net/?appName=mongosh+2.10.0
Using MongoDB:          8.0.32
Using Mongosh:          2.10.0

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

Atlas atlas-104b3m-shard-0 [primary] test> show dbs
PCEA24AD005    8.00 KiB
PCEA24AD026    8.00 KiB
PCEA24AD028  144.00 KiB
PCEA24AD043  224.00 KiB
PCEA24AD051  152.00 KiB
PCEA24CA001    8.00 KiB
PCEA24CA016  144.00 KiB
PCEA24CA019  152.00 KiB
PCEA24CA020  144.00 KiB
PCEA24CA055  152.00 KiB
PCEA24CA059   88.00 KiB
PCEA24CY001   72.00 KiB
PCEA24CY002  144.00 KiB
PCEA24CY005  152.00 KiB
PCEA24CY020  184.00 KiB
PCEA24CY022   72.00 KiB
PCEA24CY023  224.00 KiB
PCEA24CY024  232.00 KiB
PCEA24CY031  144.00 KiB
PCEA24CY055   88.00 KiB
PCEA24CY064  152.00 KiB
PCEA24IT009   80.00 KiB
PCEA24IT011  152.00 KiB
PCEA24IT024    8.00 KiB
PCEA24IT032    8.00 KiB
PCEA24IT036  152.00 KiB
PCEA24IT042   80.00 KiB
PCEA24IT047  160.00 KiB
PCEA24IT049   80.00 KiB
PCEA24IT051   80.00 KiB
PCEA24IT055  144.00 KiB
PCEA24IT056    8.00 KiB
PCEA24IT058   80.00 KiB
ProductDB     72.00 KiB
Radhe         72.00 KiB
Sample01       8.00 KiB
Sample1      224.00 KiB
pcea24cy011  144.00 KiB
pcea24cy037   72.00 KiB
sample02     144.00 KiB
test         188.00 KiB
admin               0 B
local               0 B
Atlas atlas-104b3m-shard-0 [primary] test> use PCEA24CY049
switched to db PCEA24CY049
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> for (let i = 1; i <= 50; i++) {
|
|     db.products.insertOne({
|         productId: i,
|         productName: "Product " + i ,
|         category:
|             i % 5 === 0 ? "Laptop" :
|             i % 5 === 1 ? "Mobile" :
|             i % 5 === 2 ? "Headphones" :
|             i % 5 === 3 ? "Keyboard" :
|                           "Mouse",
|
|         brand:
|             i % 3 === 0 ? "Dell" :
|             i % 3 === 1 ? "Samsung" :
|                           "HP",
|
|         price: 1000 + (i * 500),
|
|         stock: 10 + i,
|
|         rating: 3 + ((i % 3) * 0.5),
|
|         inStock: i % 4 !== 0,
|
|         tags: [
|             "electronics",
|             i % 2 === 0 ? "featured" : "new"
|         ],
|
|         seller: {
|             sellerId: 1000 + i,
|             sellerName: "Seller " + i
|         },
|
|         createdAt: new Date()
|     });
| }
|
{
  acknowledged: true,
  insertedId: ObjectId('6aaa069d06de2084c53bb0d3')
}
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({})
[
  {
    _id: ObjectId('6aaa069806de2084c53bb0a2'),
    productId: 1,
    productName: 'Product 1',
    category: 'Mobile',
    brand: 'Samsung',
    price: 1500,
    stock: 11,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1001, sellerName: 'Seller 1' },
    createdAt: ISODate('2026-09-16T03:01:44.216Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a3'),
    productId: 2,
    productName: 'Product 2',
    category: 'Headphones',
    brand: 'HP',
    price: 2000,
    stock: 12,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1002, sellerName: 'Seller 2' },
    createdAt: ISODate('2026-09-16T03:01:44.319Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a4'),
    productId: 3,
    productName: 'Product 3',
    category: 'Keyboard',
    brand: 'Dell',
    price: 2500,
    stock: 13,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1003, sellerName: 'Seller 3' },
    createdAt: ISODate('2026-09-16T03:01:44.421Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a5'),
    productId: 4,
    productName: 'Product 4',
    category: 'Mouse',
    brand: 'Samsung',
    price: 3000,
    stock: 14,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1004, sellerName: 'Seller 4' },
    createdAt: ISODate('2026-09-16T03:01:44.537Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a6'),
    productId: 5,
    productName: 'Product 5',
    category: 'Laptop',
    brand: 'HP',
    price: 3500,
    stock: 15,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1005, sellerName: 'Seller 5' },
    createdAt: ISODate('2026-09-16T03:01:44.617Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a7'),
    productId: 6,
    productName: 'Product 6',
    category: 'Mobile',
    brand: 'Dell',
    price: 4000,
    stock: 16,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1006, sellerName: 'Seller 6' },
    createdAt: ISODate('2026-09-16T03:01:44.726Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a8'),
    productId: 7,
    productName: 'Product 7',
    category: 'Headphones',
    brand: 'Samsung',
    price: 4500,
    stock: 17,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1007, sellerName: 'Seller 7' },
    createdAt: ISODate('2026-09-16T03:01:44.816Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a9'),
    productId: 8,
    productName: 'Product 8',
    category: 'Keyboard',
    brand: 'HP',
    price: 5000,
    stock: 18,
    rating: 4,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1008, sellerName: 'Seller 8' },
    createdAt: ISODate('2026-09-16T03:01:44.910Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0aa'),
    productId: 9,
    productName: 'Product 9',
    category: 'Mouse',
    brand: 'Dell',
    price: 5500,
    stock: 19,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1009, sellerName: 'Seller 9' },
    createdAt: ISODate('2026-09-16T03:01:44.985Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ab'),
    productId: 10,
    productName: 'Product 10',
    category: 'Laptop',
    brand: 'Samsung',
    price: 6000,
    stock: 20,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1010, sellerName: 'Seller 10' },
    createdAt: ISODate('2026-09-16T03:01:45.105Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ac'),
    productId: 11,
    productName: 'Product 11',
    category: 'Mobile',
    brand: 'HP',
    price: 6500,
    stock: 21,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1011, sellerName: 'Seller 11' },
    createdAt: ISODate('2026-09-16T03:01:45.221Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ad'),
    productId: 12,
    productName: 'Product 12',
    category: 'Headphones',
    brand: 'Dell',
    price: 7000,
    stock: 22,
    rating: 3,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1012, sellerName: 'Seller 12' },
    createdAt: ISODate('2026-09-16T03:01:45.321Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ae'),
    productId: 13,
    productName: 'Product 13',
    category: 'Keyboard',
    brand: 'Samsung',
    price: 7500,
    stock: 23,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1013, sellerName: 'Seller 13' },
    createdAt: ISODate('2026-09-16T03:01:45.416Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0af'),
    productId: 14,
    productName: 'Product 14',
    category: 'Mouse',
    brand: 'HP',
    price: 8000,
    stock: 24,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1014, sellerName: 'Seller 14' },
    createdAt: ISODate('2026-09-16T03:01:45.516Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b0'),
    productId: 15,
    productName: 'Product 15',
    category: 'Laptop',
    brand: 'Dell',
    price: 8500,
    stock: 25,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1015, sellerName: 'Seller 15' },
    createdAt: ISODate('2026-09-16T03:01:45.614Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b1'),
    productId: 16,
    productName: 'Product 16',
    category: 'Mobile',
    brand: 'Samsung',
    price: 9000,
    stock: 26,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1016, sellerName: 'Seller 16' },
    createdAt: ISODate('2026-09-16T03:01:45.724Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b2'),
    productId: 17,
    productName: 'Product 17',
    category: 'Headphones',
    brand: 'HP',
    price: 9500,
    stock: 27,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1017, sellerName: 'Seller 17' },
    createdAt: ISODate('2026-09-16T03:01:45.819Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b3'),
    productId: 18,
    productName: 'Product 18',
    category: 'Keyboard',
    brand: 'Dell',
    price: 10000,
    stock: 28,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1018, sellerName: 'Seller 18' },
    createdAt: ISODate('2026-09-16T03:01:45.919Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b4'),
    productId: 19,
    productName: 'Product 19',
    category: 'Mouse',
    brand: 'Samsung',
    price: 10500,
    stock: 29,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1019, sellerName: 'Seller 19' },
    createdAt: ISODate('2026-09-16T03:01:46.017Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b5'),
    productId: 20,
    productName: 'Product 20',
    category: 'Laptop',
    brand: 'HP',
    price: 11000,
    stock: 30,
    rating: 4,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1020, sellerName: 'Seller 20' },
    createdAt: ISODate('2026-09-16T03:01:46.116Z')
  }
]
Type "it" for more
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({category:"Laptop"})
[
  {
    _id: ObjectId('6aaa069806de2084c53bb0a6'),
    productId: 5,
    productName: 'Product 5',
    category: 'Laptop',
    brand: 'HP',
    price: 3500,
    stock: 15,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1005, sellerName: 'Seller 5' },
    createdAt: ISODate('2026-09-16T03:01:44.617Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ab'),
    productId: 10,
    productName: 'Product 10',
    category: 'Laptop',
    brand: 'Samsung',
    price: 6000,
    stock: 20,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1010, sellerName: 'Seller 10' },
    createdAt: ISODate('2026-09-16T03:01:45.105Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b0'),
    productId: 15,
    productName: 'Product 15',
    category: 'Laptop',
    brand: 'Dell',
    price: 8500,
    stock: 25,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1015, sellerName: 'Seller 15' },
    createdAt: ISODate('2026-09-16T03:01:45.614Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b5'),
    productId: 20,
    productName: 'Product 20',
    category: 'Laptop',
    brand: 'HP',
    price: 11000,
    stock: 30,
    rating: 4,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1020, sellerName: 'Seller 20' },
    createdAt: ISODate('2026-09-16T03:01:46.116Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0ba'),
    productId: 25,
    productName: 'Product 25',
    category: 'Laptop',
    brand: 'Samsung',
    price: 13500,
    stock: 35,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1025, sellerName: 'Seller 25' },
    createdAt: ISODate('2026-09-16T03:01:46.623Z')
  },
  {
    _id: ObjectId('6aaa069b06de2084c53bb0bf'),
    productId: 30,
    productName: 'Product 30',
    category: 'Laptop',
    brand: 'Dell',
    price: 16000,
    stock: 40,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1030, sellerName: 'Seller 30' },
    createdAt: ISODate('2026-09-16T03:01:47.120Z')
  },
  {
    _id: ObjectId('6aaa069b06de2084c53bb0c4'),
    productId: 35,
    productName: 'Product 35',
    category: 'Laptop',
    brand: 'HP',
    price: 18500,
    stock: 45,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1035, sellerName: 'Seller 35' },
    createdAt: ISODate('2026-09-16T03:01:47.625Z')
  },
  {
    _id: ObjectId('6aaa069c06de2084c53bb0c9'),
    productId: 40,
    productName: 'Product 40',
    category: 'Laptop',
    brand: 'Samsung',
    price: 21000,
    stock: 50,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1040, sellerName: 'Seller 40' },
    createdAt: ISODate('2026-09-16T03:01:48.125Z')
  },
  {
    _id: ObjectId('6aaa069c06de2084c53bb0ce'),
    productId: 45,
    productName: 'Product 45',
    category: 'Laptop',
    brand: 'Dell',
    price: 23500,
    stock: 55,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1045, sellerName: 'Seller 45' },
    createdAt: ISODate('2026-09-16T03:01:48.632Z')
  },
  {
    _id: ObjectId('6aaa069d06de2084c53bb0d3'),
    productId: 50,
    productName: 'Product 50',
    category: 'Laptop',
    brand: 'HP',
    price: 26000,
    stock: 60,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1050, sellerName: 'Seller 50' },
    createdAt: ISODate('2026-09-16T03:01:49.122Z')
  }
]
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({instock:"True"})

Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({inStock:"True"})

Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({inStock:true})
[
  {
    _id: ObjectId('6aaa069806de2084c53bb0a2'),
    productId: 1,
    productName: 'Product 1',
    category: 'Mobile',
    brand: 'Samsung',
    price: 1500,
    stock: 11,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1001, sellerName: 'Seller 1' },
    createdAt: ISODate('2026-09-16T03:01:44.216Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a3'),
    productId: 2,
    productName: 'Product 2',
    category: 'Headphones',
    brand: 'HP',
    price: 2000,
    stock: 12,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1002, sellerName: 'Seller 2' },
    createdAt: ISODate('2026-09-16T03:01:44.319Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a4'),
    productId: 3,
    productName: 'Product 3',
    category: 'Keyboard',
    brand: 'Dell',
    price: 2500,
    stock: 13,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1003, sellerName: 'Seller 3' },
    createdAt: ISODate('2026-09-16T03:01:44.421Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a6'),
    productId: 5,
    productName: 'Product 5',
    category: 'Laptop',
    brand: 'HP',
    price: 3500,
    stock: 15,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1005, sellerName: 'Seller 5' },
    createdAt: ISODate('2026-09-16T03:01:44.617Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a7'),
    productId: 6,
    productName: 'Product 6',
    category: 'Mobile',
    brand: 'Dell',
    price: 4000,
    stock: 16,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1006, sellerName: 'Seller 6' },
    createdAt: ISODate('2026-09-16T03:01:44.726Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a8'),
    productId: 7,
    productName: 'Product 7',
    category: 'Headphones',
    brand: 'Samsung',
    price: 4500,
    stock: 17,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1007, sellerName: 'Seller 7' },
    createdAt: ISODate('2026-09-16T03:01:44.816Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0aa'),
    productId: 9,
    productName: 'Product 9',
    category: 'Mouse',
    brand: 'Dell',
    price: 5500,
    stock: 19,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1009, sellerName: 'Seller 9' },
    createdAt: ISODate('2026-09-16T03:01:44.985Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ab'),
    productId: 10,
    productName: 'Product 10',
    category: 'Laptop',
    brand: 'Samsung',
    price: 6000,
    stock: 20,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1010, sellerName: 'Seller 10' },
    createdAt: ISODate('2026-09-16T03:01:45.105Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ac'),
    productId: 11,
    productName: 'Product 11',
    category: 'Mobile',
    brand: 'HP',
    price: 6500,
    stock: 21,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1011, sellerName: 'Seller 11' },
    createdAt: ISODate('2026-09-16T03:01:45.221Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ae'),
    productId: 13,
    productName: 'Product 13',
    category: 'Keyboard',
    brand: 'Samsung',
    price: 7500,
    stock: 23,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1013, sellerName: 'Seller 13' },
    createdAt: ISODate('2026-09-16T03:01:45.416Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0af'),
    productId: 14,
    productName: 'Product 14',
    category: 'Mouse',
    brand: 'HP',
    price: 8000,
    stock: 24,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1014, sellerName: 'Seller 14' },
    createdAt: ISODate('2026-09-16T03:01:45.516Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b0'),
    productId: 15,
    productName: 'Product 15',
    category: 'Laptop',
    brand: 'Dell',
    price: 8500,
    stock: 25,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1015, sellerName: 'Seller 15' },
    createdAt: ISODate('2026-09-16T03:01:45.614Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b2'),
    productId: 17,
    productName: 'Product 17',
    category: 'Headphones',
    brand: 'HP',
    price: 9500,
    stock: 27,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1017, sellerName: 'Seller 17' },
    createdAt: ISODate('2026-09-16T03:01:45.819Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b3'),
    productId: 18,
    productName: 'Product 18',
    category: 'Keyboard',
    brand: 'Dell',
    price: 10000,
    stock: 28,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1018, sellerName: 'Seller 18' },
    createdAt: ISODate('2026-09-16T03:01:45.919Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b4'),
    productId: 19,
    productName: 'Product 19',
    category: 'Mouse',
    brand: 'Samsung',
    price: 10500,
    stock: 29,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1019, sellerName: 'Seller 19' },
    createdAt: ISODate('2026-09-16T03:01:46.017Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b6'),
    productId: 21,
    productName: 'Product 21',
    category: 'Mobile',
    brand: 'Dell',
    price: 11500,
    stock: 31,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1021, sellerName: 'Seller 21' },
    createdAt: ISODate('2026-09-16T03:01:46.219Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b7'),
    productId: 22,
    productName: 'Product 22',
    category: 'Headphones',
    brand: 'Samsung',
    price: 12000,
    stock: 32,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1022, sellerName: 'Seller 22' },
    createdAt: ISODate('2026-09-16T03:01:46.330Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0b8'),
    productId: 23,
    productName: 'Product 23',
    category: 'Keyboard',
    brand: 'HP',
    price: 12500,
    stock: 33,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1023, sellerName: 'Seller 23' },
    createdAt: ISODate('2026-09-16T03:01:46.425Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0ba'),
    productId: 25,
    productName: 'Product 25',
    category: 'Laptop',
    brand: 'Samsung',
    price: 13500,
    stock: 35,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1025, sellerName: 'Seller 25' },
    createdAt: ISODate('2026-09-16T03:01:46.623Z')
  },
  {
    _id: ObjectId('6aaa069a06de2084c53bb0bb'),
    productId: 26,
    productName: 'Product 26',
    category: 'Mobile',
    brand: 'HP',
    price: 14000,
    stock: 36,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1026, sellerName: 'Seller 26' },
    createdAt: ISODate('2026-09-16T03:01:46.718Z')
  }
]
Type "it" for more
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({
|     price: {
|         $lt: 10000 } })
[
  {
    _id: ObjectId('6aaa069806de2084c53bb0a2'),
    productId: 1,
    productName: 'Product 1',
    category: 'Mobile',
    brand: 'Samsung',
    price: 1500,
    stock: 11,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1001, sellerName: 'Seller 1' },
    createdAt: ISODate('2026-09-16T03:01:44.216Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a3'),
    productId: 2,
    productName: 'Product 2',
    category: 'Headphones',
    brand: 'HP',
    price: 2000,
    stock: 12,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1002, sellerName: 'Seller 2' },
    createdAt: ISODate('2026-09-16T03:01:44.319Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a4'),
    productId: 3,
    productName: 'Product 3',
    category: 'Keyboard',
    brand: 'Dell',
    price: 2500,
    stock: 13,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1003, sellerName: 'Seller 3' },
    createdAt: ISODate('2026-09-16T03:01:44.421Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a5'),
    productId: 4,
    productName: 'Product 4',
    category: 'Mouse',
    brand: 'Samsung',
    price: 3000,
    stock: 14,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1004, sellerName: 'Seller 4' },
    createdAt: ISODate('2026-09-16T03:01:44.537Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a6'),
    productId: 5,
    productName: 'Product 5',
    category: 'Laptop',
    brand: 'HP',
    price: 3500,
    stock: 15,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1005, sellerName: 'Seller 5' },
    createdAt: ISODate('2026-09-16T03:01:44.617Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a7'),
    productId: 6,
    productName: 'Product 6',
    category: 'Mobile',
    brand: 'Dell',
    price: 4000,
    stock: 16,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1006, sellerName: 'Seller 6' },
    createdAt: ISODate('2026-09-16T03:01:44.726Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a8'),
    productId: 7,
    productName: 'Product 7',
    category: 'Headphones',
    brand: 'Samsung',
    price: 4500,
    stock: 17,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1007, sellerName: 'Seller 7' },
    createdAt: ISODate('2026-09-16T03:01:44.816Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a9'),
    productId: 8,
    productName: 'Product 8',
    category: 'Keyboard',
    brand: 'HP',
    price: 5000,
    stock: 18,
    rating: 4,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1008, sellerName: 'Seller 8' },
    createdAt: ISODate('2026-09-16T03:01:44.910Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0aa'),
    productId: 9,
    productName: 'Product 9',
    category: 'Mouse',
    brand: 'Dell',
    price: 5500,
    stock: 19,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1009, sellerName: 'Seller 9' },
    createdAt: ISODate('2026-09-16T03:01:44.985Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ab'),
    productId: 10,
    productName: 'Product 10',
    category: 'Laptop',
    brand: 'Samsung',
    price: 6000,
    stock: 20,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1010, sellerName: 'Seller 10' },
    createdAt: ISODate('2026-09-16T03:01:45.105Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ac'),
    productId: 11,
    productName: 'Product 11',
    category: 'Mobile',
    brand: 'HP',
    price: 6500,
    stock: 21,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1011, sellerName: 'Seller 11' },
    createdAt: ISODate('2026-09-16T03:01:45.221Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ad'),
    productId: 12,
    productName: 'Product 12',
    category: 'Headphones',
    brand: 'Dell',
    price: 7000,
    stock: 22,
    rating: 3,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1012, sellerName: 'Seller 12' },
    createdAt: ISODate('2026-09-16T03:01:45.321Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ae'),
    productId: 13,
    productName: 'Product 13',
    category: 'Keyboard',
    brand: 'Samsung',
    price: 7500,
    stock: 23,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1013, sellerName: 'Seller 13' },
    createdAt: ISODate('2026-09-16T03:01:45.416Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0af'),
    productId: 14,
    productName: 'Product 14',
    category: 'Mouse',
    brand: 'HP',
    price: 8000,
    stock: 24,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1014, sellerName: 'Seller 14' },
    createdAt: ISODate('2026-09-16T03:01:45.516Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b0'),
    productId: 15,
    productName: 'Product 15',
    category: 'Laptop',
    brand: 'Dell',
    price: 8500,
    stock: 25,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1015, sellerName: 'Seller 15' },
    createdAt: ISODate('2026-09-16T03:01:45.614Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b1'),
    productId: 16,
    productName: 'Product 16',
    category: 'Mobile',
    brand: 'Samsung',
    price: 9000,
    stock: 26,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1016, sellerName: 'Seller 16' },
    createdAt: ISODate('2026-09-16T03:01:45.724Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b2'),
    productId: 17,
    productName: 'Product 17',
    category: 'Headphones',
    brand: 'HP',
    price: 9500,
    stock: 27,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1017, sellerName: 'Seller 17' },
    createdAt: ISODate('2026-09-16T03:01:45.819Z')
  }
]
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.find({
|     price: {
|         $lt: 10000 } })
[
  {
    _id: ObjectId('6aaa069806de2084c53bb0a2'),
    productId: 1,
    productName: 'Product 1',
    category: 'Mobile',
    brand: 'Samsung',
    price: 1500,
    stock: 11,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1001, sellerName: 'Seller 1' },
    createdAt: ISODate('2026-09-16T03:01:44.216Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a3'),
    productId: 2,
    productName: 'Product 2',
    category: 'Headphones',
    brand: 'HP',
    price: 2000,
    stock: 12,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1002, sellerName: 'Seller 2' },
    createdAt: ISODate('2026-09-16T03:01:44.319Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a4'),
    productId: 3,
    productName: 'Product 3',
    category: 'Keyboard',
    brand: 'Dell',
    price: 2500,
    stock: 13,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1003, sellerName: 'Seller 3' },
    createdAt: ISODate('2026-09-16T03:01:44.421Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a5'),
    productId: 4,
    productName: 'Product 4',
    category: 'Mouse',
    brand: 'Samsung',
    price: 3000,
    stock: 14,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1004, sellerName: 'Seller 4' },
    createdAt: ISODate('2026-09-16T03:01:44.537Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a6'),
    productId: 5,
    productName: 'Product 5',
    category: 'Laptop',
    brand: 'HP',
    price: 3500,
    stock: 15,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1005, sellerName: 'Seller 5' },
    createdAt: ISODate('2026-09-16T03:01:44.617Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a7'),
    productId: 6,
    productName: 'Product 6',
    category: 'Mobile',
    brand: 'Dell',
    price: 4000,
    stock: 16,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1006, sellerName: 'Seller 6' },
    createdAt: ISODate('2026-09-16T03:01:44.726Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a8'),
    productId: 7,
    productName: 'Product 7',
    category: 'Headphones',
    brand: 'Samsung',
    price: 4500,
    stock: 17,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1007, sellerName: 'Seller 7' },
    createdAt: ISODate('2026-09-16T03:01:44.816Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0a9'),
    productId: 8,
    productName: 'Product 8',
    category: 'Keyboard',
    brand: 'HP',
    price: 5000,
    stock: 18,
    rating: 4,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1008, sellerName: 'Seller 8' },
    createdAt: ISODate('2026-09-16T03:01:44.910Z')
  },
  {
    _id: ObjectId('6aaa069806de2084c53bb0aa'),
    productId: 9,
    productName: 'Product 9',
    category: 'Mouse',
    brand: 'Dell',
    price: 5500,
    stock: 19,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1009, sellerName: 'Seller 9' },
    createdAt: ISODate('2026-09-16T03:01:44.985Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ab'),
    productId: 10,
    productName: 'Product 10',
    category: 'Laptop',
    brand: 'Samsung',
    price: 6000,
    stock: 20,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1010, sellerName: 'Seller 10' },
    createdAt: ISODate('2026-09-16T03:01:45.105Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ac'),
    productId: 11,
    productName: 'Product 11',
    category: 'Mobile',
    brand: 'HP',
    price: 6500,
    stock: 21,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1011, sellerName: 'Seller 11' },
    createdAt: ISODate('2026-09-16T03:01:45.221Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ad'),
    productId: 12,
    productName: 'Product 12',
    category: 'Headphones',
    brand: 'Dell',
    price: 7000,
    stock: 22,
    rating: 3,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1012, sellerName: 'Seller 12' },
    createdAt: ISODate('2026-09-16T03:01:45.321Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0ae'),
    productId: 13,
    productName: 'Product 13',
    category: 'Keyboard',
    brand: 'Samsung',
    price: 7500,
    stock: 23,
    rating: 3.5,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1013, sellerName: 'Seller 13' },
    createdAt: ISODate('2026-09-16T03:01:45.416Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0af'),
    productId: 14,
    productName: 'Product 14',
    category: 'Mouse',
    brand: 'HP',
    price: 8000,
    stock: 24,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1014, sellerName: 'Seller 14' },
    createdAt: ISODate('2026-09-16T03:01:45.516Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b0'),
    productId: 15,
    productName: 'Product 15',
    category: 'Laptop',
    brand: 'Dell',
    price: 8500,
    stock: 25,
    rating: 3,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1015, sellerName: 'Seller 15' },
    createdAt: ISODate('2026-09-16T03:01:45.614Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b1'),
    productId: 16,
    productName: 'Product 16',
    category: 'Mobile',
    brand: 'Samsung',
    price: 9000,
    stock: 26,
    rating: 3.5,
    inStock: false,
    tags: [ 'electronics', 'featured' ],
    seller: { sellerId: 1016, sellerName: 'Seller 16' },
    createdAt: ISODate('2026-09-16T03:01:45.724Z')
  },
  {
    _id: ObjectId('6aaa069906de2084c53bb0b2'),
    productId: 17,
    productName: 'Product 17',
    category: 'Headphones',
    brand: 'HP',
    price: 9500,
    stock: 27,
    rating: 4,
    inStock: true,
    tags: [ 'electronics', 'new' ],
    seller: { sellerId: 1017, sellerName: 'Seller 17' },
    createdAt: ISODate('2026-09-16T03:01:45.819Z')
  }
]
Atlas atlas-104b3m-shard-0 [primary] PCEA24CY049> db.products.updateOne(
|     { productId: 2 },
|     {
|         $set: {
|             price: 15000,
|             stock: 100
|         }
|     }
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}