/*const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
// wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
const contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
const ws = "wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261";
const web3 = new Web3(ws);
const contract = new web3.eth.Contract(abi, contractAddress);
const events = await = contract.eth.subscribe("pendingTransactions",  (error, result) => {
    console.log("show =>",events)
    if (!error) {
        var shop_wallet = "0x4798578d82Cf35919c24BB6bf9392d1e48ca6d7C"
        web3.eth.getTransaction(result)
            .then(function (transaction) {
                if (transaction !== null && transaction.to) {
                    if ((transaction.to).toLocaleLowerCase() === shop_wallet) {
                        console.log(`
                     from: ${transaction.from}  
                     amount: ${web3.utils.fromWei(transaction.value, 'ether')}`)
                    }
                }
            });
    }
});
*/

/*const Web3 = require('web3');
let web3Provider = new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261");
var web3 = new Web3(web3Provider);
var subscription = web3.eth.subscribe('logs', {
    address: '0x0d01bc6041ac8f72e1e4b831714282f755012764',
    topics: ['0x4798578d82Cf35919c24BB6bf9392d1e48ca6d7C']
}, function (error, result) {
    if (error) console.log(error);
}).on("data", function (trxData) {
    console.log("Event received", trxData);
})

*/
const fs = require('fs');
const path = require('path');
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
const config = {
  address: '0x0d01bc6041ac8f72e1e4b831714282f755012764' // set to contract address
}
const provider = new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261")
const web3 = new Web3(provider)
const contract = new web3.eth.Contract(abi, config.address);
contract.events.allEvents(function (err, event) {
  if (err) {
    console.error('Error', err)
    process.exit(1)
  }

  console.log('Event', event)
})

console.log('Waiting for events...')