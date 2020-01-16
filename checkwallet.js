const Web3 = require('web3');
const ws = "wss://ropsten.infura.io/ws";
const web3 = new Web3(ws);
web3.eth.subscribe("pendingTransactions", function(error, result) {
    if(!error) {
        var shop_wallet = "0x6c25FE295Ecee6F0D8D34fC28dca2de68538fA4a"
        web3.eth.getTransaction(result)
            .then(function (transaction) {
               if(transaction !== null && transaction.to) {
                   if((transaction.to).toLocaleLowerCase() === shop_wallet) {
                   console.log(`from: ${transaction.from} amount: ${web3.utils.fromWei(transaction.value, 'ether')}`)
                   }
               }
        });
    }
});