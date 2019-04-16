# rcv_project_backend

Backend for RCV project

## Instructions for setup

### Environment:

The environment requires Node.js and MongoDB to be installed locally on the development machine.

1. Start mongod (Mongo daemon) in either the terminal or however Mongo starts on your machine. This uses the default mongo port, so this should work fine.

2. On the command line, where you've cloned this repository, type "npm run install" (or "yarn install" if you use yarn -- preferred). That'll download the required packages from the package repository.

3. Run your command script.

- To start the server: "npm run start:dev" (or "yarn start:dev")

- To start the test suite: "npm run test" (or "yarn test"). You do not need to start the server before running the test suite - the test will setup and tear down the server automatically.
