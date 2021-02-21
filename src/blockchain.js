/**
 *                          Blockchain Class
 *  The Blockchain class contains the basic functions to create a private blockchain.
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time the application is run, the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');
const { hex2ascii } = require('hex2ascii');

class Blockchain {

    /**
     * Constructor of the class.
     * Everytime the Blockchain class is created the chain will be initialized, creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'New York Times...'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that returns a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * Note: the symbol `_` in the method name indicates that this method is a private method. 
     */
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            // check for the height to assign the `previousBlockHash`
            let height = self.chain.length;
            // Using a conditional operator, the Previous Hash is set the previous blocks hash
            // or, if the block.height -1 returns negative, null
            block.previousBlockHash = self.chain[height -1] ? self.chain[height -1].hash : null;
            // set the blocks hegiht based off how long the chain is
            block.height = height;
            // UTC time stamp
            block.time = new Date().getTime().toString().slice(0, -3);
            // hash the block coming in after converting the JSON object array to a string,
            // then convert the SHA256 hash to a string to be displayed in the block
            block.hash = await SHA256(JSON.stringify(block)).toString();
            // constant value to represent the attributes of the block that need be verified
            const blockValid = block.hash && (block.hash.length === 64) && (block.height === self.chain.length) && block.time;
            // if all attributes are valid, resolve with the block added to the chain, else reject an invalid block
            blockValid ? resolve(block) : reject(new Error('Cannot add invalid block.'));
            // if (blockValid) {
            //     resolve(block);
            // } else {
            //     reject(new Error('Cannot add invalid block.'));
            // }
        })
        .catch(error => console.log('[ERROR] ', error)) // catch and log the possible error
        // after the promise is fulfilled, push the block to the chain and update the height
        .then(block => {
            this.chain.push(block);
            this.height = this.chain.length -1;
            return block;
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will create a message request that will be used to create a signature in a Bitcoin Wallet.
     * The method returns a Promise that will resolve with the message to be signed.
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            let newMessage = address+':'+ new Date().getTime().toString().slice(0, -3) + ':starRegistry';
            resolve(newMessage);
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            
            // Get the time from the message sent as a parameter
            var timeOfMessage = message.split(":");
            timeOfMessage = parseInt(timeOfMessage[1]);
            // Get the current time
            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            // Check if the time elapsed is less than 5 minutes
            const elapsedTime = (currentTime - timeOfMessage);
            //console.log(elapsedTime);
            if (elapsedTime >= (5*60)) {
                //console.log("ElapsedTime");
                reject(new Error("Request timed out"));
            }
            // Verify the message with wallet address and signature
            if (!bitcoinMessage.verify(message, address, signature)) {
                reject(new Error("Invalid message."));
            }
            // Create the block with the star object inside
            let newBlock = new BlockClass.Block({ star });
            newBlock.owner = address; // Set the owner to the submitted address
            // call the async addblock to push the block to the chain
            newBlock = await self._addBlock(newBlock);
            // Resolve with the block added
            resolve(newBlock);
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
           let block = new BlockClass.Block;
           block.hash = hash;
           // if the blocks hash is found on the chain, return that block
            if (self.chain.includes(block.hash)) {
                block = this.getBlockByHeight(self.chain.indexOf(block.hash));
                resolve(block);
           } else {
               reject(error);
           }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Star objects existing in the chain 
     * and belong to the owner with the wallet address passed as parameter.
     * @param {*} address 
     */
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        //validate the current chain
        this.validateChain().then(errors =>{
            if (typeof errors === 'string') {
                console.log('[SUCCESS] ', errors)
            } else {
                errors.forEach(error => console.log('[ERROR] ', error));
            }
        });
        return new Promise((resolve, reject) => {
            // search through each block in the chain for blocks associated with an address
            let blocks = self.chain.filter(block => block.owner === address);
            // if no block is found then reject 
            if (blocks.length === 0 ) {
                reject(new Error("Address not found."));
            }
            // map each block retreived to the stars array, and convert the hex code back to readable format
            stars = blocks.map(block => JSON.parse(hex2ascii(block.body))); // Can be reformatted in the future to utilize the block.getBData function
            // resolve if stars exist, reject if not
            if (stars) {
                resolve(stars);
            } else {
                reject(new Error("Failed to return stars."));
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            // loop through each block in the chain
            for (let block of self.chain) {
                // if the block is valid
                if (await block.validate()) {
                    // if it is not the genesis block
                    if (block.height > 0) { 
                        // grab the previous block using the blocks height
                        let previousBlock = self.chain.filter(p => p.height === block.height -1)[0];
                        // if the previous block hash has been changed, spit out an error
                        if (block.previousBlockHash !== previousBlock.hash) {
                            errorLog.push(new Error('Invalid link: Block #'+ block.height + 'not linked to the hash of block #' + block.height -1));
                        }
                    }
                } else {
                    errorLog.push(new Error("Block #"+block.height + ":"+block.hash));
                }
            }
            if (errorLog.length > 0) {
                resolve(errorLog);
            } else {
                resolve("No errors detected.");
            }
        });
    }

}

module.exports.Blockchain = Blockchain;   