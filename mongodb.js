/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */

const { MongoClient, ServerApiVersion } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { CustomError, KeyError } = require('../handle-error/index');

const db = 'cn_db';
// const uri = `mongodb://127.0.0.1:27017/${db}`;
const maxPoolSize = 10;
// const uri = `mongodb+srv://chum:${encodeURIComponent('Chum1@1Noeurn')}@cluster0.ru6ebzh.mongodb.net/cn_db?retryWrites=true&w=majority`;
const uri = `mongodb+srv://chum:${encodeURIComponent('yoeurnchum1999')}@cluster0.8sjctgv.mongodb.net/cn_db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  maxPoolSize,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
client.connect();
/**
 * List collection MongoDB
 * @returns {Promise}
 */
const cnListCollection = function cnListCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      // const collection = await client.db(db).collection('users').drop()
      let listCollections = await client.db(db).listCollections().toArray();
      if (listCollections.length > 0) {
        listCollections = Object.fromEntries(
          listCollections.map(({ name }) => [name, name]),
        );
      }
      resolve(listCollections);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * List data MongoDB
 * @param {collectionName} collectionName Collection inside database name must be lowercase.
 * @param {parent} parent Parent object to filter.
 * @returns {Promise}
 */
const cnListItems = function cnListItems(req, collectionName, parent = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      let items = [];
      if (req.query && Object.keys(req.query).length > 0) {
        items = collection.find(req.query).sort({ CreatedAt: -1 });
      } else if (Object.keys(parent).length > 0) {
        items = collection.find(parent).sort({ CreatedAt: -1 });
      } else {
        items = collection.find().sort({ CreatedAt: -1 });
      }
      items = await items.toArray();
      resolve(items);
    } catch (err) {
      reject(err);
    }
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
        const response = await collection.findOne({
          [`${collectionName[0].toUpperCase()}_ID`]: ID,
        });
        if (!response) {
          throw new CustomError(
            { key: KeyError.ResourceNotFound, message: `ID ${ID} is not found.` },
          );
        } else {
          resolve(response);
        }
      } else {
        throw new CustomError(
          { key: KeyError.InputValidation, message: 'Incorrect ID to get item.' },
        );
      }
    } catch (err) {
      reject(err);
    }
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
        req.body = {
          ...req.body,
          [`${collectionName.toUpperCase()}_ID`]: ID,
          CreatedAt: new Date(),
        };
        await collection.insertOne(req.body);
        const item = await cnGetItem(ID);
        resolve(item);
      } else {
        throw new CustomError({ key: KeyError.InputValidation, message: 'Required data.' });
      }
    } catch (err) {
      reject(err);
    }
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
      const [collectionName] = ID.split(':');
      const collection = client.db(db).collection(collectionName);
      req.body = { ...req.body, UpdatedAt: new Date() };
      await collection.updateOne(
        { [`${collectionName.toUpperCase()}_ID`]: ID },
        { $set: req.body },
      );
      const item = await cnGetItem(ID);
      // await cnUpdateRelatedResources(req, collectionName, ID);
      resolve(item);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param {collectionName} collectionName Collection name to delete all data
 * @returns {Promise}
 */
const cnDeleteAllItem = function cnDeleteAllItem(req, collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = client.db(db).collection(collectionName);
      await collection.deleteMany({});
      const result = await cnListItems(req, collectionName);
      if (result.length === 0) {
        resolve({ message: 'All data deleted successfully.' });
      } else {
        throw new CustomError({ key: KeyError.ResourceNotFound, message: 'All data is error delete.' });
      }
    } catch (err) {
      reject(err);
    }
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
      const result = await collection.deleteOne({
        [`${collectionName[0].toUpperCase()}_ID`]: ID,
      });
      if (result.deletedCount !== 0) {
        resolve({ message: `Item with ID ${ID} was deleted.` });
      } else {
        throw new CustomError({ key: KeyError.ResourceNotFound, message: `ID ${ID} not found to delete.` });
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 */
function findObjectsRecursive(obj, condition, result = []) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  if (condition(obj)) {
    console.log('obj', obj);
    result.push(obj);
  }

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      findObjectsRecursive(value, condition, result);
    }
  }
  return result;
}

/**
 *
 */
const cnUpdateRelatedResources = function cnUpdateRelatedResources(
  req,
  collectionName,
  ID,
) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const collection = await cnListCollection();
      delete req.query;
      for (const keyCollection in collection) {
        if (keyCollection !== collectionName) {
          const collectionItem = await cnListItems(req, keyCollection);
          const condition = (obj) => obj.Id === ID;
          const matchingObjects = findObjectsRecursive(
            collectionItem,
            condition,
          );
          // console.log('matchingObjects', matchingObjects);
        }
      }
      resolve(collection);
    } catch (err) {
      reject({ ErrorMessage: err.message });
    } finally {
      await client.close();
    }
  });
};
// // My default
// const myDefault = function myDefault(collectionName) {
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
// cnListCollection().then((res) => {
//   console.log(res);
// })
module.exports = {
  cnListItems,
  cnGetItem,
  cnInsertOneItem,
  cnDeleteOneItem,
  cnUpdateOneItem,
  cnDeleteAllItem,
  cnListCollection,
};
