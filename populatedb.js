#! /usr/bin/env node

console.log(
  'This script populates some test items, categorys  to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const categorys = [];

const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Fantasy category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categorys[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, price, number_in_stock, category) {
  const itemdetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  };
  if (category != false) itemdetail.category = category;

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categorys');
  await Promise.all([
    categoryCreate(
      0,
      'Hardware',
      'Computer Hardware such as Ram, SSD or processors'
    ),
    categoryCreate(1, 'Software', 'The best programs for your computer'),
    categoryCreate(2, 'Other', 'Cables, and other computer accessories'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(
      0,
      'Processor',
      'The best processors in the market from intel and AMD',
      334,
      3,
      [categorys[0]]
    ),
    itemCreate(
      1,
      "RAM",
      'Very fast RAM DDR4 & DDR 5',
      40,
      2,
      [categorys[0]]
    ),
    itemCreate(
      2,
      'SSD',
      'The fastest Memory in the whole market',
      90,
      1,
      [categorys[0]]
    ),
    itemCreate(
      3,
      'Antivirus',
      'McAfee Antivurus 2024',
      50,
      5,
      [categorys[1]]
    ),
    itemCreate(
      4,
      'Windows',
      "The best operating system from Microsoft with best price",
      100,
      0,
      [categorys[1]]
    ),
    itemCreate(
      5,
      'SSD with free antivirus',
      'Summary of test item 1',
      130,
      5,
      [categorys[0], categorys[1]]
    ),
    itemCreate(
      6,
      'Test item 2',
      'Summary of test item 2',
      21,
      12,
      false
    ),
  ]);
}
