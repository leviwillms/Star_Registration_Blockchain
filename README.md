# Private Blockchain Application

This project demonstrates the fundamental concepts of a Blockchain platform.
Concepts like:
    - Blocks
    - Blockchain
    - Transactions
    - Wallets
    - Blockchain Identity
    - Proof of Existance

This project was created from boilerplate code with a REST Api already setup to expose some of the functionalities
implemented in the private blockchain.

## What problem was solved implementing this private Blockchain application?

Your employer is trying to make a test of concept on how a Blockchain application can be implemented in his company.
He is an astronomy fans and he spend most of his free time on searching stars in the sky, that's why he would like
to create a test application that will allows him to register stars, and also some others of his friends can register stars
too but making sure the application know who owned each star.

### What is the process describe by the employer to be implemented in the application?

1. The application will create a Genesis Block when it is run.
2. The user will request the application to send a message to be signed using a Wallet and in this way verify the ownership over the wallet address. The message format will be: `<WALLET_ADRESS>:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
3. Once the user has the message, they can use a Bitcoin Wallet to sign the message.
4. The user will try to submit the Star object in JSON format: `wallet address`, `message`, `signature` and the `star` object with the star information.
    The Star information will be formed in this format:
    ```json
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Testing the story 4"
		}
    ```
5. The application will verify if the time elapsed from the request ownership (the time is contained in the message) and the time when a user submits the star is less than 5 minutes.
6. If everything is okay the star information will be converted into hexidecimal, then stored in the block and added to the `chain`
7. The application will allow us to retrieve the Star objects belong to a specific owner (wallet address). 


## What tools or technologies were used to create this application?

- This application was created using Node.js and Javascript programming language. The architecture will use ES6 classes
because it will help to organize the code and facilitate the maintnance of the code.
- Some of the libraries or npm modules used are:
    - "bitcoinjs-lib": "^4.0.3",
    - "bitcoinjs-message": "^2.0.0",
    - "body-parser": "^1.18.3",
    - "crypto-js": "^3.1.9-1",
    - "express": "^4.16.4",
    - "hex2ascii": "0.0.3",
    - "morgan": "^1.9.1",

Libraries purpose:

1. `bitcoinjs-lib` and `bitcoinjs-message`. Those libraries will help us to verify the wallet address ownership, we are going to use it to verify the signature.
2. `express` The REST Api created for the purpose of this project it is being created using Express.js framework.
3. `body-parser` this library will be used as middleware module for Express and will help us to read the json data submitted in a POST request.
4. `crypto-js` This module contain some of the most important cryotographic methods and will help us to create the block hash.
5. `hex2ascii` This library will help us to **decode** the data saved in the body of a Block.

## Understanding the boilerplate code

The Boilerplate code is a simple architecture for a Blockchain application, it includes a REST APIs application to expose the Blockchain application methods to your client applications or users.

1. `app.js` file contains the configuration and initialization of the REST Api, this code was not changed for the project.
2. `BlockchainController.js` file contains the routes of the REST Api. Those are the methods that expose the urls needed to call when a request is made to the application.
3. `src` folder. In here reside the main two classes needed to create the Blockchain application. `block.js` and `blockchain.js` files were created that contain the `Block` and `BlockChain` classes. Aside from the skeleton of the classes, this is where all of the development of the project was done.

### Starting with the application code:

First thing first, to use the application, download or clone the code.

Then, install all the libraries and module dependencies, to do that: open a terminal and run the command `npm install`

**( Remember to be able to run this project you will need to have installed in your computer Node.js and npm )**

At this point use the command: `node app.js` to run the application.

You can check in your terminal if the Express application is listening on the PORT 8000.

## How to test the application functionalities?

To test the application I recommend you to use POSTMAN, this tool will help you to make the requests to the API.

1. Run the application using the command `node app.js`
You should see in your terminal a message indicating that the server is listening in port 8000:
> Server Listening for port: 8000

2. To make sure the application is working fine and it creates the Genesis Block you can use POSTMAN to request the Genesis block:
    ![Request: http://localhost:8000/block/0 ](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca360cc_request-genesis/request-genesis.png)
3. Make your first request of ownership sending your wallet address:
    ![Request: http://localhost:8000/requestValidation ](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca36182_request-ownership/request-ownership.png)
4. Sign the message with your Wallet:
    ![Use the Wallet to sign a message](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca36182_request-ownership/request-ownership.png)
5. Submit your Star
     ![Request: http://localhost:8000/submitstar](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca365d3_signing-message/signing-message.png)
6. Retrieve Stars owned by me
    ![Request: http://localhost:8000/blocks/<WALLET_ADDRESS>](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/April/5ca362b9_retrieve-stars/retrieve-stars.png)