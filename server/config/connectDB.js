const mongoose = require("mongoose");
const AssetsCategory = require("../models/assets/assetsCat");
const AssetsProduct = require("../models/assets/assetsProduct");
const MarketPrice = require("../models/assets/marketPrice");
const Transactions = require("../models/assets/assetsTransactions");
const Statements = require("../models/assets/assetsStatements");
const AssetsCategoryCurve = require("../models/assets/categoryCurve");
const log = require("../utills/logers/logger");

async function DB_connect() {
  try {
    mongoose.connect(process.env.DB_URL);
    log.success("DATABASE CONNECTION SUCCESSFUL");
    
    await AssetsCategory.collection.createIndex({ user: 1 });
    await AssetsCategory.collection.createIndex({ parentCategory: 1 });
    await AssetsCategory.collection.createIndex({ user: 1, parentCategory: 1 });
    await AssetsCategory.collection.createIndex({ name: 1 });
    await AssetsCategory.collection.createIndex({ standaloneIRR: 1 });
    await AssetsCategory.collection.createIndex({ consolidatedIRR: 1 });
    
    await AssetsProduct.collection.createIndex({ symbol: 1 });
    await AssetsProduct.collection.createIndex({ user: 1 });
    await AssetsProduct.collection.createIndex({ user: 1, symbol: 1 });
    await AssetsProduct.collection.createIndex({ categories: 1 });
    await AssetsProduct.collection.createIndex({ user: 1, categories: 1 });
    
    await MarketPrice.collection.createIndex({ symbol: 1 });
    await MarketPrice.collection.createIndex({ updatedAt: 1 });
    
    await Transactions.collection.createIndex({ product: 1, Date: 1 });
    await Transactions.collection.createIndex({ type: 1 });
    await Transactions.collection.createIndex({ category_id: 1, Date: 1 });
    await Transactions.collection.createIndex({ category_id: 1 });
    await Transactions.collection.createIndex({ user: 1, Date: 1 });
    
    await Statements.collection.createIndex({ category_id: 1, date: 1 });
    await Statements.collection.createIndex({ type: 1 });
    await Statements.collection.createIndex({ user: 1, date: 1 });
    
    await AssetsCategoryCurve.collection.createIndex({ user: 1 });
    await AssetsCategoryCurve.collection.createIndex({ category_id: 1 });
    await AssetsCategoryCurve.collection.createIndex({ date: 1 });
    await AssetsCategoryCurve.collection.createIndex({ user: 1, category_id: 1 });
    await AssetsCategoryCurve.collection.createIndex({ user: 1, category_id: 1, date: 1 });
    
    // ------------------- Locks (TTL index) -------------------
    await mongoose.connection.db
    .collection("locks")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    
  } catch (err) {
    log.error("DATABASE CONNECTION FAILED");
  }
}

module.exports = DB_connect;
