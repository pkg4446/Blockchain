const {bank}  = require('../core');

console.log("Blockchain work on");

bank.minting(3);
bank.burn(3);


const TransactionDATA = {
    privateKey: "Bank",
    publicKey:  "trans",
    amount:     2,
}

bank.remittance(TransactionDATA);

bank.newBlock();

bank.Balance("Bank");
bank.Balance("mintCorp");
bank.Balance("trans");
