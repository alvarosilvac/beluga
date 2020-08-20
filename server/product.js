const app = require('./index.js');
const rimraf = require("rimraf");
const stripe = require("stripe")(process.env.STRIPE_KEY);

app.get('/product-info/:id', function(req, res) {
  stripe.skus.list({ product: req.params.id },
    function(err, product) {
      err ? res.status(500).send(err) : res.json(product);
    });
});

app.get('/product-info/', async function(req, res) {
  try {
    let skus = await stripe.skus.list()
    let products = await stripe.products.list()

    let _skus = skus.data
    let _products = products.data
    let product = {}

    let final = _skus.map(sku => {
      for(let i = 0; i < _products.length; i++){
        if(_products[i].id == sku.product){
          let price = (sku.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          
          product = {
            name: _products[i].name,
            description: _products[i].description,
            attributes_prod: _products[i].attributes,
            images: _products[i].images,
            price_parsed: price,
            ...sku
          }
        }
      }
      return product
    })
    res.json(final)
  }
  catch(err) {
    console.log(err)
    res.status(500).send(err)
  }
});

app.post("/create-product", function(req, res) {
  const product = {
    name: req.body.name,
    type: 'good'
  }
  if (req.body.attributes)
    product["attributes"] = [req.body.attributes];

  stripe.products.create(product, function(err, result) {
    err ? res.status(500).send(err) : res.json(result);
  });
});

app.post("/update-product/:id", function(req, res) {
  let product = {};
  if (req.body.name) product["name"] = req.body.name;
  if (req.body.attributes) product["attributes"] = [req.body.attributes];

  stripe.products.update(req.params.id, product, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-product/:id", function(req, res) {
  rimraf(`./public/assets/${req.params.id}`, function(error) {
    stripe.products.del(req.params.id, function(err, confirmation) {
      err ? res.status(500).send(err) : res.json({ success: true });
    });
  });
});

app.post("/create-sku", function(req, res) {
  let sku = {
    price: +req.body.price,
    currency: 'usd',
    inventory: {
      type: req.body.inventory.type
    },
    product: req.body.product_id
  }
  if (req.body.inventory.type === "finite")
    sku.inventory["quantity"] = +req.body.inventory.quantity;

  if (req.body.attributes)
    sku["attributes"] = req.body.attributes;

  stripe.skus.create(sku, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json(confirmation);
  });
});

app.post("/update-sku/:id", function(req, res) {
  let sku = {
    price: req.body.price
  };
  if (req.body.inventory)
    sku["inventory"] = { type: req.body.inventory.type }

  if (req.body.inventory && req.body.inventory.type === "finite")
    sku.inventory["quantity"] = +req.body.inventory.quantity;

  if (req.body.attributes)
    sku["attributes"] = req.body.attributes;

  stripe.skus.update(req.params.id, sku, function(err, success) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-sku/:id", function(req, res) {
  stripe.skus.del(req.params.id, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-collection/:id", function(req, res) {
  rimraf(`./public/assets/collection-${req.params.id}`, function(err) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});