const stripe = require("stripe")(process.env.STRIPE_KEY);
const fs = require('fs-extra');

const sync_products = async () => {
  try {
    console.log("Syncing products...")
    let skus = await stripe.skus.list()
    let products = await stripe.products.list()
  
    let _skus = skus.data
    let _products = products.data
  
    let read = await fs.readFile("./src/assets/store_config.json", 'utf8')
  
    let curr_data = JSON.parse(read);

    let curr_products = curr_data.products

    let final_products = []
  
    console.log("Current products:", curr_products)
  
    let stripe_data = _skus.map(sku => {
      for(let i = 0; i < _products.length; i++){
        if(_products[i].id == sku.product){
          product = {
            "name": _products[i].name,
            "is_live": false,
            "url": _products[i].name.toLowerCase().replace(/ /g, "-"),
            "description": _products[i].description,
            "stripe_id": sku.product,
            "created": sku.created
          }
        }
      }
      return product
    })
  
    console.log("Stripe data:", stripe_data, "Length:", stripe_data.length)
  
    for(let i = 0; i < stripe_data.length; i++) {
      let found = false
      for(let j = 0; j < curr_products.length; j++) {
        if(stripe_data[i].name == curr_products[j].name) {
          stripe_data[i].is_live = curr_products[j].is_live
          console.log("Found:", curr_products[j])
          break
        }
      }
      for(let j = 0; j < final_products.length; j++) {
        if(final_products[j].name == stripe_data[i].name) {
          found = true
          break
        }
      }
      if(!found)
        final_products.push(stripe_data[i])
    }

    console.log("Final products:", final_products)

    curr_data.products = final_products
  
    await fs.writeFile("./src/assets/store_config.json", JSON.stringify(curr_data), 'utf8')
    
    console.log("SAVED!")
  }
  catch(err) {
    console.log("ERROR!", err)
  }
}

module.exports = {
  sync_products
}