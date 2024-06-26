const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of items,  category counts (in parallel)
  const [numItems, numCategorys] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Computer Online Shop',
    item_count: numItems,
    category_count: numCategorys,
  });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name price category')
    .sort({ name: 1 })
    .populate('category')
    .exec();

  res.render('item_list', { title: 'Item list', item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  // Get details of items, item instances for specific item
  const item = await Item.findById(req.params.id).populate('category').exec();

  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: item.name,
    item: item,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our item.
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('item_form', {
    title: 'Create Item',
    categories: allCategories,
  });
});

// Handle item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: item create POST');
});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: item delete GET');
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: item delete POST');
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: item update GET');
});

// Handle item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: item update POST');
});
