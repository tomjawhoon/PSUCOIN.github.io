const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const infura = {
    projectId: '37dd526435b74012b996e147cda1c261',
    projectSecret: '55c6430534c042a1b762cd5f6e0f0a55',
    endpoint: "wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261"
    
}
const contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
const router = express.Router();
const app = express();
const web3 = new Web3(infura.endpoint);
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
const contract = new web3.eth.Contract(abi,contractAddress);
app.use(cors());
app.use('/api', bodyParser.json(), router);   //[use json]
app.use('/api', bodyParser.urlencoded({ extended: false }), router);

router.route('/')
    .get(async (req, res) => {
        try {
            const events = await contract.getPastEvents('Transfer', {
                filter: { _to: '0x07E4590839ed31A7ad3c9Fb7807Df67eADD5A230' },
                fromBlock: 0,
                toBlock: 'latest'
            });
            let transactions = {}
            events.forEach((event) => {
                const { transactionHash, returnValues } = event;
                console.log(returnValues);
                const { _from, _to, _value } = returnValues;
                transactions[transactionHash] = { from: _from, to: _to, value: _value }
               // console.log(transactions);
            })
            res.json(transactions)
        } catch (e) {
            console.error(e);
            res.json(e)
        }
    });
app.listen(80, () => console.log('server is ready'))