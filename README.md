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

# Usage submodule
1. ### Adding into repository project
- Create a folder's name
  ```
  submodule
  ``` 
- Go to folder's name `submodule`
  ```
  cd submodule
  ``` 
- Add `mongodb` inside folder's name `submodule`
    ```bash
    git submodule add https://github.com/chum-ch/mongodb.git
    ```
2. Remove
  - Remove folder 
    ```
    rm -rf submodule/mongodb
    ```
  - Adding submodule after removed
    ```bash
    git submodule add --force https://github.com/chum-ch/mongodb.git
    ```
# Download Mongdb 
[Download](https://www.mongodb.com/try/download/shell)

## Installing the Database Tools on macOS
<img src="https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg" width="256"> <img src="https://brew.sh/assets/img/homebrew-256x256.png" height="72">

[Installation](https://www.mongodb.com/docs/database-tools/installation/installation-macos)
## The MongoDB Homebrew Tap

This is a custom [Homebrew](https://brew.sh) tap for official MongoDB software.

### Setup

You can add the custom tap in a MacOS terminal session using:

```bash
brew tap mongodb/brew
```

### Installing Formulae

Once the tap has been added, use the instructions below to install the software packages you need. You can choose to install either the latest version of the MongoDB Server (recommended), or a specific version if desired.

### Installing the Latest mongodb-community Server, Shell, and the Database Tools Together

 * Install the latest available production release of the [MongoDB Community Server](https://docs.mongodb.com/manual/). This includes the MongoDB Server processes `mongod` and `mongos`, the [MongoDB Database Tools](https://docs.mongodb.com/database-tools/), and the `install_compass` script to separately install [MongoDB Compass](https://docs.mongodb.com/compass/). Currently, this will install MongoDB Server 6.0.x.

   ```bash
   brew install mongodb-community
   ```

### Installing only the Shell or the Database Tools

 * Install only the latest [`mongosh` shell](https://www.mongodb.com/docs/mongodb-shell/) for connecting to remote MongoDB instances. If you installed the MongoDB Server in the step above, the shell was included in that installation. Use this command only if you need to install the `mongosh` shell separately.

   ```bash
   brew install mongosh
   ```

 * Install only the latest [MongoDB Database Tools](https://docs.mongodb.com/database-tools/), a suite of command-line tools (`mongoimport`, `mongoexport`, `mongodump`, etc) for working with a MongoDB Server instance. If you installed the MongoDB Server in the step above, the Database Tools were included in that installation. Use this command only if you need to install the Database Tools separately.

   ```bash
   brew install mongodb-database-tools
   ```

### Installing a Specific Version of the mongodb-community Server

Alternatively, you can install a specific version of the MongoDB Server if desired.

 * Install the latest 6.0.x production release of MongoDB Community Server:
   ```bash
   brew install mongodb-community@6.0
   ```

 * Install the latest 5.0.x production release of MongoDB Community Server:
   ```bash
   brew install mongodb-community@5.0
   ```

 * Install the latest 4.4.x production release of MongoDB Community Server:
   ```bash
   brew install mongodb-community@4.4
   ```

## Default Paths for the mongodb-community Formula

In addition to installing the MongoDB server and tool binaries, the `mongodb-community` formula creates:

 * a configuration file: `$(brew --prefix)/etc/mongod.conf`
 * a log directory path: `$(brew --prefix)/var/log/mongodb`
 * a data directory path: `$(brew --prefix)/var/mongodb`

The default value for `brew --prefix` depends on your CPU architecture:

  * Intel: `/usr/local`
  * M1: `/opt/homebrew`

## Starting the mongodb-community Server

### Run `mongod` as a service

To have `launchd` start `mongod` immediately and also restart at login, use:

```bash
brew services start mongodb-community
```
If you manage `mongod` as a service it will use the default paths listed above. To stop the server instance use:

```bash
brew services stop mongodb-community
```

### Start `mongod` manually

If you don't want or need a background MongoDB service you can run:

```bash
mongod --config /usr/local/etc/mongod.conf
```
Note: if you do not include the `--config` option with a path to a configuration file, the MongoDB server does not have a default configuration file or log directory path and will use a data directory path of `/data/db`.

To shutdown `mongod` started manually, use the `admin` database and run `db.shutdownServer()`:

 * Shutdown for MongoDB Community Server 6.x and up:

```bash
mongosh admin --eval "db.shutdownServer()"
```

 * Shutdown for MongoDB Community Server 5.0 and below:

```bash
mongosh admin --eval "db.shutdownServer()"
```

## Uninstalling the mongodb-community Server

If you need to uninstall the MongoDB Server, use:

```bash
brew uninstall mongodb-community
```

Note that this does not uninstall the bundled Database Tools. To uninstall the Database Tools, additionally run the folowing:

```bash
brew uninstall mongodb-database-tools
```