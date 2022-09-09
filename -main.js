const {Blockchain, Transaction} = require('./-Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 

// signature so only the user can access thier wallet and only they can send money

const myKey = ec.keyFromPrivate('9b74a33678b3258a4811d35214d3547d57548e9470658a736f36fe9f3aefb9b5');
const myWalletAdresss = myKey.getPublic('hex');

let omariCoin = new Blockchain();

const tx1 = new Transaction(myWalletAdresss, 'public key goes here', 10);
tx1.signTransaction(myKey);
omariCoin.addTransaction(tx1);

// they pending, so we need to make the miners mine
console.log('\n Starting the miner......');
omariCoin.minePendingTransactions(myWalletAdresss); // omar happen to mine the addresses, *his reward goes to pending
console.log('\nThe balance of Omar is ', omariCoin.getBlalanceOfAdress(myWalletAdresss));

omariCoin.chain[1].transactions[0].amount = 1; // alter chain

console.log('Is Chain Valid? ', omariCoin.isChainValid());