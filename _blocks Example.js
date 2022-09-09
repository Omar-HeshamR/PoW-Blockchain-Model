const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = '') { // creates a block
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){ // creates the has for each block code
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }
    // proof of work(mining) : prove of computing to make a block for safter of total chain altering
    mineBlock(difficulty){ // bitcoin does through a specspic computiton difficulty of achiving x amount of 0s
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined: " + this.hash);
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1; // control the power of computing
    }
    createGenesisBlock(){
        return new Block(0, "02/23/2022", "Genesis block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let omariCoin = new Blockchain();
console.log('mining block 1....');
omariCoin.addBlock(new Block(1, "21/09/2021", {amount: 4}));
console.log('mining block 2....');
omariCoin.addBlock(new Block(2, "22/09/2021", {amount: 9}));

// MORE TESTING BELOW:
// console.log(JSON.stringify(omariCoin, null, 4)); // show block chain
// ----------------------------------------------------------------------
// console.log('Is Block Chain Valid? ' + omariCoin.isChainValid());
// omariCoin.chain[1].data = {amount: 100000}; // altered with blockchain, is not valid
// omariCoin.chain[1].hash = omariCoin.chain[1].calculateHash(); // not smart, blocks are linked with each other
// console.log('Is Block Chain Valid? ' + omariCoin.isChainValid());
