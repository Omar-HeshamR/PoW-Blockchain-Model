const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey){
        if (signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transaction from other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress === null) return true;
        if(!this.signature||this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

}
                 
class Block{
    constructor(timestamp, transactions, previousHash = '') { // creates a block
        this.timestamp = timestamp;
        this.transactions = transactions;
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

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // control the power of computing
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock(){
        return new Block("02/23/2022", "Genesis block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block Succesfully Mined!");
        this.chain.push(block);
         
        this.pendingTransactions = [];
        // in IRL there is way too many transactions so it wont send it all to one block 
    }
    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include to and from addresses!');
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalud transaction to chain!');
        }
        this.pendingTransactions.push(transaction);
    }
    // in crypto you dont actually have a balance but the system goes through all your transaction to check what you "own"

    getBlalanceOfAdress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(!currentBlock.hasValidTransaction()){
                return false;
            }
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


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;

// MORE TESTING BELOW:
// let omariCoin = new Blockchain();
// omariCoin.createTransaction(new Transaction('address 1', 'address 2', 100));
// omariCoin.createTransaction(new Transaction('address 2', 'address 1', 50));

// // they pending, so we need to make the miners mine
// console.log('\n Starting the miner......');
// omariCoin.minePendingTransactions('omar-address'); // omar happen to mine the addresses, *his reward goes to pending
// console.log('\n The balance of Omar is ', omariCoin.getBlalanceOfAdress('omar-address'));

// console.log('\n Starting the miner again......');
// omariCoin.minePendingTransactions('omar-address');
// console.log('\n The balance of Omar is ', omariCoin.getBlalanceOfAdress('omar-address'));
