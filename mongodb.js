/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const db = 'cn_db';
const uri = `mongodb://localhost:27017/${db}`;
const maxPoolSize = 10;
// const uri = `mongodb+srv://chum:${encodeURIComponent('Chum1@1Noeurn')}@cluster0.ru6ebzh.mongodb.net/cn_db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize,
});
client.connect();
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
      resolve(collection);
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};
// cnLisCollection();
/**
 * List datas MongoDB
 * @param {collectionName} collectionName Collection inside database name must be lowercase.
 * @param {parent} parent Parent object to filter.
 * @returns {Promise}
*/
const cnListItems = function cnListItems(req, collectionName, parent = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // await client.connect();
      const collection = client.db(db).collection(collectionName);
      let items = [];
      if (Object.keys(req.query).length > 0) {
        items = await collection.find(req.query).toArray();
      } else if (Object.keys(parent).length > 0) {
        items = await collection.find(parent).toArray();
      } else {
        items = await collection.find().toArray();
      }
      resolve(items);
    } catch (err) {
      console.log('List error', err);
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};
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
          throw ({ message: `ID ${ID} is not found.` });
        } else {
          resolve(response);
        }
      } else {
        throw ({ message: 'Incorrect ID to get item.' });
      }
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};
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
        const ID = `${collectionName}:${uuidv4().replace(/-/g, '')}`;
        req.body = { ...req.body, [`${collectionName.toUpperCase()}_ID`]: ID };
        await collection.insertOne(req.body);
        const item = await cnGetItem(ID);
        resolve(item);
      } else {
        throw ({ message: 'Required data.' });
      }
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};
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
      const item = await cnGetItem(ID);
      resolve(item);
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};

/**
 *
 * @param {collectionName} collectionName Collection name to delete all datas
 * @returns {Promise}
 */

// My default
const cnDeleteAllItem = function cnDeleteAllItem(req, collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      await collection.deleteMany({});
      const result = await cnListItems(req, collectionName);
      if (result.length === 0) {
        resolve({ message: 'All datas deleted sucessfully.' });
      } else {
        throw ({ message: 'All datas is error delete.' });
      }
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};

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
        resolve({ message: `Item with ID ${ID} was deleted.` });
      } else {
        throw ({ message: `ID ${ID} not found to delete.` });
      }
    } catch (err) {
      reject({ ErrorMessage: err.message });
    }
    // finally {
    //   await client.close();
    // }
  });
};

// My default
// const myDefatul = function myDefatul(collectionName) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await client.connect();
//       const collection = client.db(db).collection(collectionName);
//       const result = await collection.insertOne(req.body);
//       const response = await collection.findOne({ _id: result.insertedId });
//       resolve(response);
//     } catch (err) {
//       reject({ ErrorMessage: err.message });
//     } finally {
//       await client.close();
//     }
//   });
// };
module.exports = {
  cnListItems, cnGetItem, cnInsertOneItem, cnDeleteOneItem, cnUpdateOneItem, cnDeleteAllItem, cnLisCollection,
};
