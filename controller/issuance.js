const {bank}  = require('../core');

console.log("Blockchain work on");

bank.minting(3);
bank.burn(4);


const TransactionDATA = {
    privateKey: "SmarthiveMainBank",
    publicKey:  "trans",
    amount:     2,
}

bank.remittance(TransactionDATA);

bank.newBlock();

bank.Balance("048b3b83e91b24b78bb7839329174d13bad2da98da21d9b3f9cd00695a2dca7aa1576436197aa30d7f30a29707b22e9b5c2e3fb687497f64899142175c21d880c7");
bank.Balance("mintCorp");
bank.Balance("trans");
