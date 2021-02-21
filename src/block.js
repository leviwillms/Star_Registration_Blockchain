/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform, 
 *  it will store the data and act as a dataset for the application.
 *  The class will expose a method to validate the data... The body of
 *  the block contains an Object that contains the data to be stored;
 *  the data should be stored encoded.
 *  All the exposed methods return a Promise to allow all the methods 
 *  run asynchronous.
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

    /**
     * Constructor - argument data will be the object containing the transaction data
     * @param {*} data 
     */
	constructor(data){
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = 0;                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }
    
    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data. As a consequence, the hash of the block should be different.
     */
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Save the current block hash
            let currentHash = self.hash;
            // nullify the block's hash
            self.hash = null;
            // Recalculate the hash of the Block
            let newHash = SHA256(JSON.stringify(self)).toString();
            // assign the original hash value to blocks hash
            self.hash = currentHash;
            // Comparing if the hashes changed
            if (newHash != currentHash) {
                // Returning the Block is not valid
                reject(false);
            } else {
                // Returning the Block is valid
                resolve(true);
            }
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     */
    getBData() {
        // Getting the encoded data saved in the Block
        let self = this;
        return new Promise((resolve, reject) => {
            // Decoding the data to retrieve the JSON representation of the object
            let decodedData = hex2ascii(self.body);
            // Parse the data to an object to be retrieved.
            decodedData = JSON.parse(decodedData);
            // Resolve with the data if the object isn't the Genesis block
            if (self.height > 0){
                resolve(decodedData);
            } else {    
                reject(error);
            }
        });
    }

}

module.exports.Block = Block;                    // Exposing the Block class as a module