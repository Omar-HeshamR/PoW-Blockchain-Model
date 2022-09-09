const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
                 //// file: minning rewards + transactions
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

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // control the power of computing
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
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block Succesfully Mined!");
        this.chain.push(block);
         
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
        // in IRL there is way too many transactions so it wont send it all to one block 
    }
    createTransaction(transaction){
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
omariCoin.createTransaction(new Transaction('address 1', 'address 2', 100));
omariCoin.createTransaction(new Transaction('address 2', 'address 1', 50));

// MORE TESTING BELOW:
// they pending, so we need to make the miners mine
// console.log('\n Starting the miner......');
// omariCoin.minePendingTransactions('omar-address'); // omar happen to mine the addresses, *his reward goes to pending
// console.log('\n The balance of Omar is ', omariCoin.getBlalanceOfAdress('omar-address'));

// console.log('\n Starting the miner again......');
// omariCoin.minePendingTransactions('omar-address');
// console.log('\n The balance of Omar is ', omariCoin.getBlalanceOfAdress('omar-address'));
