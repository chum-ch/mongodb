# MongoDB Node.js Driver

The official [MongoDB](https://www.mongodb.com/) driver for Node.js.

**Upgrading to version 5? Take a look at our [upgrade guide here](https://github.com/mongodb/node-mongodb-native/blob/HEAD/etc/notes/CHANGES_5.0.0.md)!**

## Quick Links

| Site                     | Link                                                                                                              |
| -------------------------| ----------------------------------------------------------------------------------------------------------------- |
| Documentation            | [www.mongodb.com/docs/drivers/node](https://www.mongodb.com/docs/drivers/node)                                    |
| API Docs                 | [mongodb.github.io/node-mongodb-native](https://mongodb.github.io/node-mongodb-native)                            |
| `npm` package            | [www.npmjs.com/package/mongodb](https://www.npmjs.com/package/mongodb)                                            |
| MongoDB                  | [www.mongodb.com](https://www.mongodb.com)                                                                        |
| MongoDB University       | [learn.mongodb.com](https://learn.mongodb.com/catalog?labels=%5B%22Language%22%5D&values=%5B%22Node.js%22%5D)     |
| MongoDB Developer Center | [www.mongodb.com/developer](https://www.mongodb.com/developer/languages/javascript/)                              |
| Stack Overflow           | [stackoverflow.com](https://stackoverflow.com/search?q=%28%5Btypescript%5D+or+%5Bjavascript%5D+or+%5Bnode.js%5D%29+and+%5Bmongodb%5D) |
| Source Code              | [github.com/mongodb/node-mongodb-native](https://github.com/mongodb/node-mongodb-native)                          |
| Upgrade to v5            | [etc/notes/CHANGES_5.0.0.md](https://github.com/mongodb/node-mongodb-native/blob/HEAD/etc/notes/CHANGES_5.0.0.md) |
| Contributing             | [CONTRIBUTING.md](https://github.com/mongodb/node-mongodb-native/blob/HEAD/CONTRIBUTING.md)                       |
| Changelog                | [HISTORY.md](https://github.com/mongodb/node-mongodb-native/blob/HEAD/HISTORY.md)                                 |

# Submodule
1. ### Adding into repository project.
- Create a folder's name
  ```
  submodule
  ``` 
- Add this repo inside `submodule`.
    ```bash
    git submodule add https://github.com/chum-ch/mongodb.git
    ```
2. Remove.
  - Remove folder 
    ```
    rm -rf shared-modules/dynamodb-helper
    ```
  - Adding submodule after removed
    ```bash
    git submodule add --force https://github.com/chum-ch/mongodb.git
    ```
#