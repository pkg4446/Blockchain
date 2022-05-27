const {bank}  = require('../core');

console.log("Blockchain work on");

bank.minting(3);
bank.burn(4);


const TransactionDATA = {
    privateKey: "mintCorp",
    publicKey:  "bank",
    amount:     2,
}

bank.remittance(TransactionDATA);

bank.newBlock();

//bank.lookUp();
bank.Balance("bank");
bank.Balance("mintCorp");
bank.Balance("trans");
