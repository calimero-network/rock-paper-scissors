# Rock Paper Scissors Game with Calimero SDK and Vue.js

This repository contains the implementation of the classic game Rock Paper Scissors, built using the Calimero Application SDK and a user interface (UI) implemented in Vue.js.

## Project Structure

The project is structured into two main parts:

1. **Logic Folder:** This folder contains the contract for the game, implemented using the Calimero SDK. It also includes a build script to compile the contract into a WebAssembly (WASM) file.

2. **Vue.js UI:** The user interface for the game is implemented using Vue.js. It interacts with the deployed contract to facilitate the gameplay.

## Getting Started

Follow these steps to get the project up and running:

### Running local nodes
You need to run Calimero nodes on your machine to get started. Follow the [Getting started](https://calimero-network.github.io/getting-started/setup) documentation.

### Building the Contract

1. Navigate to the `logic/rock-paper-scissors` folder.
2. Run the build script to compile the contract into a WASM file.

### Deploying the Contract

Follow the deployment instructions provided in the [Calimero documentation](https://calimero-network.github.io/build/publish-app). You need to deploy the game on at least two nodes to play the game.

### Building the UI

1. Ensure you have `yarn` installed. If not, you can install it using `npm install -g yarn`.
2. Run `yarn dev` in the `app` folder, to start the development server for the Vue.js application.
3. Enter the calimero node URL you got from the first step and click `Connect`
4. Run another instance of the UI and connect to another node.
5. Now you have two players that can start playing the game! 

