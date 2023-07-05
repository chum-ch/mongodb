const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require('uuid');

const uuid = uuidv4().replace(/-/g, '');
const db = 'cn_db';
const uri = `mongodb+srv://chum:${encodeURIComponent('Chum1@1Noeurn')}@cluster0.ru6ebzh.mongodb.net/cn_db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
/**
 * List collection MongoDB
 * @returns {Promise}
*/
const cnLisCollection = function cnLisCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      // const collection = await client.db(db).collection('users').drop()
      let collection = await client.db(db).listCollections().toArray();
      if (collection.length > 0) {
        collection = Object.fromEntries(collection.map(({ name }) => [name, name]));
      }
      resolve(collection)
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}
/**
 * List datas MongoDB
 * @param {collectionName} collection Collection inside database name must be lowercase.
 * @returns {Promise}
*/
const cnListItems = function cnListItems(collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      const result = await collection.find().toArray();
      resolve(result)
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}
/**
 * Get data MongoDB
 * @param {ID} ID ID to get specific item.
 * @returns {Promise}
 */
const cnGetItem = function cnGetItem(ID) {
  return new Promise(async (resolve, reject) => {
    try {
      const collectionName = ID.split(':');
      if (ID && collectionName.length === 2) {
        await client.connect();
        const collection = client.db(db).collection(collectionName[0]);
        const response = await collection.findOne({ [`${collectionName[0].toUpperCase()}_ID`]: ID });
        if (!response) {
          throw ({message: `ID ${ID} is not found.`})
        } else {
          resolve(response)
        }
      } else {
        throw ({ message: 'Incorrect ID to get item.' })
      }
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}
/**
 * Insert one data MongoDB
 * @param {req} req
 * @param {collectionName} collectionName Name of collection inside database name must be lowercase.
 * @returns {Promise}
*/
const cnInsertOneItem = function cnInsertOneItem(req, collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.body && Object.keys(req.body).length > 0) {
        await client.connect();
        const collection = client.db(db).collection(collectionName);
        req.body = { ...req.body, [`${collectionName.toUpperCase()}_ID`]: `${collectionName}:${uuid}` }
        const result = await collection.insertOne(req.body);
        await client.connect();
        const response = await collection.findOne({ _id: result.insertedId });
        resolve(response)
      } else {
        throw ({ message: 'Required data.' })
      }
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}
/**
 * 
 * @param {*} req 
 * @param {*} ID ID to update specific item.
 * @returns {Promise}
 */
const cnUpdateOneItem = function cnUpdateOneItem(req, ID) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collectionName = ID.split(':');
      const collection = client.db(db).collection(collectionName[0]);
      await collection.updateOne({ [`${collectionName[0].toUpperCase()}_ID`]: ID }, { $set: req.body });
      const response = await collection.findOne({ [`${collectionName[0].toUpperCase()}_ID`]: ID });
      resolve(response)
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}

/**
 * 
 * @param {collectionName} collectionName Collection name to delete all datas
 * @returns {Promise}
 */

// My default 
const cnDeleteAllItem = function cnDeleteAllItem(collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      await collection.deleteMany({});
      await client.connect();
      const result = await collection.find().toArray();
      if (result.length === 0) {
        resolve({ message: 'All datas deleted sucessfully.' })
      } else {
        throw ({ message: 'All datas is error delete.' })
      }
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}

/**
 * 
 * @param {*} ID ID to delete specific item.
 * @returns {Promise}
 */
const cnDeleteOneItem = function cnDeleteOneItem(ID) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collectionName = ID.split(':');
      const collection = client.db(db).collection(collectionName[0]);
      const result = await collection.deleteOne({ [`${collectionName[0].toUpperCase()}_ID`]: ID });
      if (result.deletedCount !== 0) {
        resolve({ message: `Item with ID ${ID} was deleted.` })
      } else {
        throw ({ message: `ID ${ID} not found to delete.` })
      }
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}

// My default 
const myDefatul = function myDefatul(collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      const result = await collection.insertOne(req.body);
      const response = await collection.findOne({ _id: result.insertedId });
      resolve(response)
    } catch (err) {
      reject({ ErrorMessage: err.message })
    } finally {
      await client.close();
    }
  })
}
module.exports = { cnListItems, cnGetItem, cnInsertOneItem, cnDeleteOneItem, cnUpdateOneItem, cnDeleteAllItem, cnLisCollection }
