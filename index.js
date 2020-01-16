const EthereumTx = require('ethereumjs-tx').Transaction;
const axios = require('axios');
const Web3 = require('web3');
const Buffer = require('safer-buffer').Buffer;
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/cc3c1b3d2d0d439f8c842f7d68438c0b'));
const privateKey = Buffer.from('E1C661DE87DF9B024A63EC2F47B041D76326082FFD7B26CEF6F100F901E232C3', 'hex');
const gasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
        low: response.data.safeLow,
        medium: response.data.average,
        high: response.data.fast
    }
    return prices;
} 
const transfer = async () => {
    var gas = await gasPrices();
    var gasPrice = (gas.low * 1000000000).toFixed(0);
    var transactionCount = await web3.eth.getTransactionCount("0x6c25FE295Ecee6F0D8D34fC28dca2de68538fA4a");
    var amount = web3.utils.toWei('0.1', 'ether');
    const txParams = {
        nonce: web3.utils.toHex(transactionCount),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(21000),
        to: '0x4e47581813943E481D1243953b9d951B9B6ef6Ec',
        value: web3.utils.toHex(amount)
        
      }
    const tx = new EthereumTx(txParams, { chain: 'ropsten' });
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    var signTransaction = '0x' + serializedTx.toString('hex');
    const result = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    return result;
}
transfer().then(data => {
    console.log(data);
}).catch(e => {
  console.log(e)
})