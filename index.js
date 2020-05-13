const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const app = express()
const router = express.Router()
const Web3 = require("web3");
const fs = require('fs');
const path = require('path');
const EthereumTx = require('ethereumjs-tx').Transaction;
const Buffer = require('safer-buffer').Buffer;
const cors = require('cors');
//TEST GIT
//TEST GIT
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });


require('tls').DEFAULT_MIN_VERSION = 'TLSv1'
var http = require('http').Server(app);
var io = require('socket.io')(http);
const infura =
{
    projectId: '37dd526435b74012b996e147cda1c261',
    projectSecret: '55c6430534c042a1b762cd5f6e0f0a55',
    endpoint: "wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261"
}
const web3 = new Web3(infura.endpoint);
// <!--===============================================================================================-->
app.use(cors());
var engines = require('consolidate');
app.use('/api', router);
app.use('/front', express.static(path.join(__dirname, 'front')));
app.set('views', __dirname + '/');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
var Web3EthAccounts = require('web3-eth-accounts');
var firebase = require('firebase')
app.use(bodyParser.urlencoded({ extended: true }), router)
app.use(bodyParser.json, router)
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
//app.use(bodyParser.json({ type: 'X-Foo', 'bar'}))
// app.use(bodyParser.json(200, { 'Content-Type': 'text/plain' }))
// app.use(function (req, res, next) {
//     console.log(req.body) // populated!
// })

// <!--===============================================================================================-->
var firebaseConfig = {
    apiKey: "AIzaSyDPwR_Tlxe5MODIEPugWCnO_drEh6-4jjw",
    authDomain: "login-psu-final.firebaseapp.com",
    databaseURL: "https://login-psu-final.firebaseio.com",
    projectId: "login-psu-final",
    storageBucket: "login-psu-final.appspot.com",
    messagingSenderId: "152285332333",
    appId: "1:152285332333:web:bc428892887d5004"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// <!--===============================================================================================-->
router.route('/')
    .get((req, res) => {
        res.render('PSULOGIN.html')
    })
    .post((req, res) => {
        soap.createClient(url, (err, client) => {
            if (err)
                console.error(err);
            else {
                let user = {}
                user.username = req.body.username
                user.password = req.body.password
                client.GetStaffDetails(user, (err, response) => {
                    if (response.GetStaffDetailsResult.string[0] == "") { //เข้ารหัสผิดดดดด ๆ 
                        res.redirect('/errorlogin')
                        console.error(err);
                    }
                    else { //เข้ารหัสถูกกกกกกก แล้วจร้า
                        var account = new Web3EthAccounts('ws://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261');
                        var user_eth = account.create();
                        console.log("Show_profile ", response)
                        database.ref('users').child(user.username).once("value", snapshot => {
                            if (snapshot.exists()) { // check ????????????????????????
                                console.log('already exists')
                                // res.send('<script>alert("??????????????????");</script>');
                                res.redirect('/index/' + user.username)
                                return false;
                            } else {
                                console.log('bad bad')

                                database.ref('users').child(user.username).set({
                                    address: user_eth.address,
                                    privateKey: user_eth.privateKey.substring(2).toUpperCase(),
                                    balance: "",
                                    name: response,
                                }).then(() => {
                                    console.log('create new wallet')
                                    // console.log('test_Show',name)
                                    // res.send({ user_eth, response });
                                    res.redirect('/index/' + user.username)
                                    return false;
                                    // res.redirect("/showdata)                 
                                }).catch(e => {
                                    console.log(e)
                                })
                            }
                        })
                    }
                });
            }

        });
    })

router.route('/loginadmin')
    .post((req, res) => {
        let user = {}
        user.username = req.body.username
        user.password = req.body.password
        user.name = req.body.name
        user.surname = req.body.surname
        console.log("user.username", user.username)
        console.log("user.password", user.password)
        console.log("user.name", user.name)
        console.log("user.surname", user.surname)
        if (user.username != "") { //เข้ารหัสผิดดดดด ๆ 
            database.ref('users').child(user.username).once("value", snapshot => {
                if (snapshot.exists()) { // check ????????????????????????
                    console.log('already exists')
                    // res.send('<script>alert("??????????????????");</script>');
                    res.redirect('/indexadmin/' + user.username)
                    return false;
                } else {
                    console.log('Error admin')
                    res.redirect('/error')
                }
            })
        }

    })


router.route('/register')
    .post((req, res) => {

        let user = {}
        user.username = req.body.username
        user.password = req.body.password
        user.name = req.body.name
        user.surname = req.body.surname
        console.log("user.username", user.username)
        console.log("user.password", user.password)
        console.log("user.name", user.name)
        console.log("user.surname", user.surname)


        if (user.username != "") { //เข้ารหัสผิดดดดด ๆ 
            //เข้ารหัสถูกกกกกกก แล้วจร้า
            var account = new Web3EthAccounts('ws://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261');
            var user_eth = account.create();

            //console.log("Show_profile ", response)
            database.ref('users').child(user.username).once("value", snapshot => {
                if (snapshot.exists()) { // check ????????????????????????
                    console.log('already exists')
                    // res.send('<script>alert("??????????????????");</script>');
                    //res.redirect('/index/' + user.username)
                    return false;
                } else {
                    // let string = []
                    console.log('bad bad')
                    const newObject = {
                        address: user_eth.address,
                        privateKey: user_eth.privateKey.substring(2).toUpperCase(),
                        balance: "",
                        pass: user.password,
                        name: {
                            GetStaffDetailsResult: {
                                string: [user.username, user.username, user.surname, "60"]
                            }
                        }
                    }
                    database.ref('users').child(user.username).set(newObject).then(() => {
                        console.log('create new wallet')
                        res.redirect('/index/' + user.username)
                        return false;
                    })

                    // database.ref('users').child(user.username).set({
                    //     address: user_eth.address,
                    //     privateKey: user_eth.privateKey.substring(2).toUpperCase(),
                    //     balance: "",
                    //     name: user.username,
                    //     surname: user.surname,
                    //     pass: user.password
                    // }).then(() => {
                    //     console.log('create new wallet')
                    //     res.redirect('/adminlogin')
                    //     return false;
                    // }).catch(e => {
                    //     console.log(e)
                    // })
                }
            })

        }



    })
// <!--===============================================================================================-->
router.route('/send/:id')
    .get((req, res) => {
        res.render('tranfer.html')
    })

router.route('/send/:id/confirm')
    .get((req, res) => {
        async function Tranfer() {
            // const id = req.headers.toaddress;

            const id = req.headers.toaddress;
            const fromAddress = req.headers.fromaddress;
            const money = req.headers.money;
            const privateKey = req.headers.privatekey;
            const id_sender = req.headers.id;
            let testid = "IDERROR"

            // const testvalue = req.headers.result;

            // console.log('xx: ', req.headers)
            console.log("id", id) //to id 
            //////////////////////////// sender ///////////////////////////////////////////////////
            console.log("id_sender", id_sender)
            const toAddress_sender = await getReceiverWalletFromId(id_sender)
            let id_sendershow = toAddress_sender.val();
            let id_sendershow_balance = id_sendershow.balance;
            console.log("id_sendershow_balance =>", id_sendershow_balance)
            //////////////////////////// sender ///////////////////////////////////////////////////

            //let totalvalue = toAddress2.balance;
            console.log("testvalue === >", req.header.value1)
            console.log("fromAddress =>", fromAddress)
            console.log("money =>", money)
            console.log("privateKey =>", privateKey)
            //var id = string.match(/(\d){10}/gm)

            if (id == '') {
                console.log("TESTID")
                res.json(testid)
            }




            const toAddress = await getReceiverWalletFromId(id)


            console.log("toAddress_show_toAddress =>", toAddress)

            let toAddress2 = toAddress.val();
            let totalvalue = toAddress2.balance;
            let test = "ERROR";
            //let moneybalance = "moneybalance";

            console.log("toAddress2 =>", toAddress2)
            console.log("totalvalue =>", totalvalue)
            web3.setProvider(new web3.providers.HttpProvider("https://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261"));
            var abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
            var count = await web3.eth.getTransactionCount(fromAddress);
            var contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
            var contract = new web3.eth.Contract(abi, contractAddress, { from: fromAddress });
            if (money == '') {
                console.log("money..errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                res.json(test)
            }

            else if (money > id_sendershow_balance) {
                console.log("MAX_MONEY..........................................")
                res.json(test)
            }


            else if (money < 0) {
                console.log("MIN_MONEY..........................................")
                res.json(test)
            }


            var weiTokenAmount = web3.utils.toWei(String(money), 'ether');
            var Transaction = {
                "from": fromAddress,
                "nonce": "0x" + count.toString(16),
                "gasPrice": "0x003B9ACA00",
                "gasLimit": "0x250CA",//151754
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(toAddress2.address, weiTokenAmount).encodeABI(),
                "chainId": 0x03
            };
            var privKey = Buffer.from(privateKey, 'hex');
            console.log("privKey = > ", privKey);
            const tx = new EthereumTx(Transaction, { chain: 'kovan' });
            tx.sign(privKey);
            var serializedTx = tx.serialize();
            console.log("serializedTx =>", serializedTx)
            /////////////////////////////////////////////////// errrrorr //////////////////////////////////////////////////////////////////////////
            /*if (money <= id_sendershow_balance) {
                console.log("errorrrrrrrrrrrrrrrrrrrrrrrr.receipt")
                res.json(moneybalance)
            }*/
            var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
            console.log("receipt =>", receipt)
            res.json(JSON.stringify(receipt.transactionHash))
            database.ref('users').child(id).once("value", snapshot => {
                if (snapshot.exists()) {
                    console.log('Have_data')
                    database.ref('users').child(id).update({
                        balance: parseInt(req.headers.money) + parseInt(toAddress2.balance)
                    }).then(() => {
                        console.log('push_send_perfect')
                    }).catch(e => {
                        console.log(e)
                    })
                }
            })
            // return receipt
        }
        Tranfer().then((result) => {
            console.log(result)
        })


    })
// <!--===============================================================================================-->

router.route('/transection/:id/confirm')
    .get(async (req, res) => {
        const id = req.headers.id;
        const toAddress = await getReceiverWalletFromId(id)
        const toAddress2 = toAddress.val();
        const address = toAddress2.address;
        console.log("address ==================>", address);
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
        const contract = new web3.eth.Contract(abi, contractAddress);
        try {
            const events = await contract.getPastEvents('Transfer', {
                filter: { to: null },
                fromBlock: 0,
                toBlock: 'latest'
            });
            let transections = events.map((event) => {
                const transaction = event.transactionHash;
                console.log("event ===> ", transaction);
                const { returnValues } = event;
                console.log(returnValues);
                const { from, to, tokens, } = returnValues;
                return { from: from, to: to, tokens: tokens, transaction: transaction }
            })
            res.json(transections);
        } catch (e) {
            console.error(e);
            res.json(e)
        }
    });


/*router.route('/transectionrealtime/:id/confirm')
    .get(async (req, res) => {
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const address = '0x0d01bc6041ac8f72e1e4b831714282f755012764' // set to contract address
        const provider = new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261")
        const web3 = new Web3(provider)
        const contract = new web3.eth.Contract(abi, address);
        contract.events.allEvents((err, event) => {
            if (err) {
                console.error('Error', err)
                process.exit(1)
            }
            console.log('Event', event)
            res.json(event);
        })
        console.log('Waiting ...!')
    });
*/

wss.on('connection', function connection(ws) { // สร้าง connection
    ws.on('message', async function incoming(message) { // รอรับ data อะไรก็ตาม ที่มาจาก client แบบตลอดเวลา
        console.log('client:', message);
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const address = '0x0d01bc6041ac8f72e1e4b831714282f755012764' // set to contract address
        const provider = new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261")
        const web3 = new Web3(provider)
        const contract = new web3.eth.Contract(abi, address);
        contract.events.allEvents((err, event) => {
            if (err) {
                console.error('Error', err)
                process.exit(1)
            }
            console.log('Event', event)
            ws.send(JSON.stringify(event))
        })
        console.log('Waiting ...!')
    });
    ws.on('close', function close() {
        console.log('disconnected');    // จะทำงานเมื่อปิด Connection ในตัวอย่างคือ ปิด Browser
    });
});

/*router.route('/transection/:id/confirm')
    .get(async (req, res) => {
        const id = req.headers.id;
        const toAddress = await getReceiverWalletFromId(id)
        const toAddress2 = toAddress.val();
        const address = toAddress2.address;
        console.log("address ==================>", address);
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
        const contract = new web3.eth.Contract(abi, contractAddress);
        try {
            const events = await contract.getPastEvents('Transfer', {
                filter: { to: null },
                fromBlock: 0,
                toBlock: 'latest'
            });
            let transections = events.map((event) => {
                const transaction = event.transactionHash;
                console.log("event ===> ", transaction);
                const { returnValues } = event;
                console.log(returnValues);
                const { from, to, tokens, } = returnValues;
                return { from: from, to: to, tokens: tokens, transaction: transaction }
            })
            res.json(transections);
        } catch (e) {
            console.error(e);
            res.json(e)
        }
    });*/



/*io.on('/transectionrealtime/:id/confirm',  (socket)  => {
    socket.on(async (req, res) => {
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const address = '0x0d01bc6041ac8f72e1e4b831714282f755012764' // set to contract address
        const provider = new Web3.providers.WebsocketProvider("wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261")
        const web3 = new Web3(provider)
        const contract = new web3.eth.Contract(abi, address);
        contract.events.allEvents(function (err, event) {
            if (err) {
                console.error('Error', err)
                process.exit(1)
            }

            console.log('Event', event)
            res.json(event);

        })
        console.log('Waiting for events...')
    });
});
*/

/*router.route('/transection_from/:id/confirm')
    .get(async (req, res) => {
        const id = req.headers.id;
        const toAddress = await getReceiverWalletFromId(id)
        const toAddress2 = toAddress.val();
        const address = toAddress2.address;
        console.log("address ==================> frommm", address);
        const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
        const contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
        const contract = new web3.eth.Contract(abi, contractAddress);

        try {
            const events = await contract.getPastEvents('Transfer', {
                filter: { from: null },
                fromBlock: 0,
                toBlock: 'latest'

            });
            //let transactions = {}
            let transections = events.map((event) => {
                //console.log("event ===> " ,event  );
                const { returnValues } = event;
                console.log(returnValues);
                const { from, to, tokens } = returnValues;
                return { from: from, to: to, tokens: tokens, }
            })
            // res.json(JSON.stringify(returnValues))
            res.json(transections);
        } catch (e) {
            console.error(e);
            res.json(e)
        }
    });*/

// <!--===============================================================================================-->

router.route('/showdata/:id')
    .get((req, res) => {
        res.render('showdata.html')
    })
router.route('/showdata/:id/confirm')
    .get((req, res) => {
        //var test = req.headers.id;
        var test = [];
        var leadsRef = database.ref('users');
        leadsRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var childData = childSnapshot.val();
                console.log("childData_formnode===>", childData)
                test.push(childData)
            });
        });
        res.json(JSON.stringify(test))
        // var test_Show = req.headers
        //var test_Show1 = req.data
        // console.log("test_Show ===>", test_Show)
    })

// <!--===============================================================================================-->
router.route('/showdata_admin/:id/confirm')
    .get((req, res) => {
        //var test = req.headers.id;
        var test = [];
        var leadsRef = database.ref('users');
        leadsRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var childData = childSnapshot.val();
                console.log("showdata_admin ===>", childData)
                test.push(childData)
                console.log("test ===>", test) // id , address , balance
            });
        });
        res.json(JSON.stringify(test))
    })

// <!--===============================================================================================-->

router.route('/error')
    .get((req, res) => {
        res.render('error.html')
    })
// <!--===============================================================================================-->
router.route('/adminlogin/')
    .get((req, res) => {
        res.render('adminlogin.html')
    })
// <!--===============================================================================================-->

router.route('/register')
    .get((req, res) => {
        res.render('Register.html')
    })
// <!--===============================================================================================-->

router.route('/test_admin/:id')
    .get((req, res) => {
        res.render('test_admin.html')
    })
// <!--===============================================================================================-->
router.route('/static/:id')
    .get((req, res) => {
        res.render('static.html')
    })
// <!--===============================================================================================-->
router.route('/index/:id')
    .get((req, res) => {
        res.render('index.html')
    })
// <!--===============================================================================================-->
router.route('/index/:id/confirm')
    .get((req, res) => {
    })
// <!--===============================================================================================-->
//profile.html
router.route('/indexadmin/:id')
    .get((req, res) => {
        res.render('indexadmin.html')
    })
// <!--===============================================================================================-->
router.route('/indexadmin/:id/confirm')
    .get((req, res) => {
    })
// <!--===============================================================================================-->
router.route('/showdataadmin/:id')
    .get((req, res) => {
        res.render('showdataadmin.html')
    })
// <!--===============================================================================================-->   
router.route('/showdataadmin/:id/confirm')
    .get((req, res) => {
    })
// <!--===============================================================================================-->   
router.route('/balanceadmin/:id')
    .get((req, res) => {
        res.render('balanceadmin.html')
    })
// <!--===============================================================================================-->
router.route('/balanceadmin/:id/confirm')
    .get((req, res) => {
    })
// <!--===============================================================================================-->
router.route('/tranferadmin/:id')
    .get((req, res) => {
        res.render('tranferadmin.html')
    })
// <!--===============================================================================================-->   
router.route('/tranferadmin/:id/confirm')
    .get((req, res) => {
    })
// <!--===============================================================================================-->
router.route('/profile/:id')
    .get((req, res) => {
        res.render('profile.html')
    })
// <!--===============================================================================================-->
router.route('/balance/:id')
    .get((req, res) => {
        res.render('balance.html')
    })
// <!--===============================================================================================-->

router.route('/show/:id')
    .get((req, res) => {
        res.render('show.html')
    })
// <!--===============================================================================================-->   
router.route('/show/:id/confirm')
    .get((req, res) => {
    })


//     router.route('/show/:id')
//     .get((req, res) => {
//         res.render('show.html')
//     })
// // <!--===============================================================================================-->   
// router.route('/show/:id/confirm')
//     .get((req, res) => {
//     })

// router.route('/camera/:id')
// app.get('/camera/:id', (req, res) => {
//     res.render('camera.html')
// })

router.route('/camera/:id')
    .get((req, res) => {
        res.render('camera.html')
    })

router.route('/camera/:id/confirm')
    .get((req, res) => {
        const show = req.headers.content;
        console.log(JSON.stringify(show))
        res.json(JSON.stringify(show))
    })

router.route('/sendQrcode/:id')
    .get((req, res) => {
        res.render('sendQrcode.html')
    })

router.route('/sendQrcode/:id/confirm')
    .get((req, res) => {
        let data = req.body;
        console.log('this is sendQrcode', { data })
        // res.render('sendQrcode.html')
        // res.render('sendQrcode.html', { data: 'somethings' })
    })

// app.get('/camera/:id/confirm', (req, res) => {
//     const show = req.headers.content;
//     console.log(JSON.stringify(show))
//     res.json(JSON.stringify(show))
// })

// app.get('/sendQrcode/:id/', (req, res) => {
//     let data = req.body;
//     console.log('this is sendQrcode', { data })
//     // res.render('sendQrcode.html')
//     res.render('sendQrcode.html', { data: 'somethings' })
// })

// router.route('/sendQrcode/:id/confirm')

// app.post('/sendQrcode/:id/confirm', (req, res) => {
//     const show = req.body;
//     console.log(JSON.stringify(show))
//     res.json(JSON.stringify(show))
// })

router.route('/Calendar/:id')
    .get((req, res) => {
        res.render('Calendar.html')
    })

router.route('/event1/:id')
    .get((req, res) => {
        res.render('event1.html')
    })

router.route('/event3/:id')
    .get((req, res) => {
        res.render('event3.html')
    })

router.route('/event4/:id')
    .get((req, res) => {
        res.render('event4.html')
    })

router.route('/event5/:id')
    .get((req, res) => {
        res.render('event5.html')
    })





router.route('/TranferQrcode/:id')
    .get((req, res) => {
        res.render('TranferQrcode.html')
    })

router.route('/Receive/:id')
    .get((req, res) => {
        res.render('Receive.html')
    })

router.route('/test/:id')
    .get((req, res) => {
        res.render('test.html')
    })


router.route('/test1/:id')
    .get((req, res) => {
        res.render('test1.html')
    })

router.route('/test2/:id')
    .get((req, res) => {
        res.render('test2.html')
    })

router.route('/test3/:id')
    .get((req, res) => {
        res.render('test3.html')
    })


router.route('/test4/:id')
    .get((req, res) => {
        res.render('test4.html')
    })

router.route('/errorlogin')
    .get((req, res) => {
        res.render('errorlogin.html')
    })



router.route('/success/:id')
    .get((req, res) => {
        res.render('success.html')
    })

router.route('/NOTSUCCESS/:id')
    .get((req, res) => {
        res.render('NOTSUCCESS.html')
    })

router.route('/notsend/:id')
    .get((req, res) => {
        res.render('notsend.html')
    })

router.route('/Notid/:id')
    .get((req, res) => {
        res.render('Notid.html')
    })

router.route('/transection/:id')
    .get((req, res) => {
        res.render('transection.html')
    })


router.route('/TranferQrcode/:id/confirm')
    .get((req, res) => {
        // const show = req.headers;
        // console.log("show Qrcode ",show)
    })

router.route('/ShowTranferQrcode/:id')
    .get((req, res) => {
        res.render('ShowTranferQrcode.html')
    })

router.route('/ShowTranferQrcode/:id/confirm')
    .post((req, res) => {
        async function Tranfer() {
            //  const showvalue = req.headers;
            // console.log("Camera",showvalue)

            const id = req.headers.id;
            const fromAddress = req.headers.fromaddress;
            const money = req.headers.money;
            const privateKey = req.headers.privatekey;
            // const testvalue = req.headers.result;

            // console.log('xx: ', req.headers)
            console.log("id", id)
            console.log("testvalue === >", req.header.value1)
            console.log("fromAddress =>", fromAddress)
            console.log("money =>", money)
            console.log("privateKey =>", privateKey)
            // const id = req.headers.content;
            // console.log("id  ", id)

            // const toAddress = await getReceiverWalletFromId(id)
            // console.log("toAddress_show_toAddress =>", toAddress)
            let test = "ERROR";
            let toAddress2 = req.headers.content;
            // let totalvalue = toAddress2.balance;
            //let id_sender = toAddress.val([1].address);

            console.log("toAddress2 =>", toAddress2)
            // console.log("totalvalue =>", totalvalue)

            web3.setProvider(new web3.providers.HttpProvider("https://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261"));
            var abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
            var count = await web3.eth.getTransactionCount(fromAddress);
            var contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
            var contract = new web3.eth.Contract(abi, contractAddress, { from: fromAddress });
            if (money == '') {
                console.log("money..errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                res.json(test)
            }
            var weiTokenAmount = web3.utils.toWei(String(money), 'ether');
            var Transaction = {
                "from": fromAddress,
                "nonce": "0x" + count.toString(16),
                "gasPrice": "0x003B9ACA00",
                "gasLimit": "0x250CA",//151754
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(toAddress2, weiTokenAmount).encodeABI(),
                "chainId": 0x03
            };
            var privKey = Buffer.from(privateKey, 'hex');
            console.log("privKey = > ", privKey);
            const tx = new EthereumTx(Transaction, { chain: 'kovan' });
            tx.sign(privKey);
            var serializedTx = tx.serialize();
            console.log("serializedTx =>", serializedTx)
            var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
            console.log("receipt =>", receipt)
            res.json(JSON.stringify(receipt.transactionHash))

            // database.ref('users').child(id).once("value", snapshot => {
            //     if (snapshot.exists()) { // check ????????????????????????
            //         console.log('Have_data')
            //         database.ref('users').child(id).update({
            //             // balance: (req.headers.money+toAddress2.balance),
            //             balance: parseInt(req.headers.money) + parseInt(toAddress2.balance)
            //         }).then(() => {
            //             console.log('push_send_perfect')
            //         }).catch(e => {
            //             console.log(e)
            //         })
            //     }
            // })
            // return receipt
        }

        Tranfer().then((result) => {
            console.log(result)
        })
    })


router.route('/balance/:id/confirm')
    .get((req, res) => {
        web3.setProvider(new web3.providers.HttpProvider("https://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261"));
        function getERC20TokenBalance(tokenAddress, walletAddress, id, callback) {
            let minABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
            let contract = new web3.eth.Contract(minABI, tokenAddress);
            contract.methods.balanceOf(walletAddress).call((error, balance) => {
                contract.methods.decimals().call((error, decimals) => {
                    balance = balance / (10 ** decimals);
                    console.log("decimals => ", decimals);
                    console.log("balance => ", balance, "PSU");

                    database.ref('users').child(id).update({
                        // address: user_eth.address,
                        // privateKey: user_eth.privateKey.substring(2).toUpperCase(),
                        balance: balance,
                        // name: response,
                    }).then(() => {
                        console.log('Push balance in firebase')
                        // console.log('test_Show',name)
                        // res.send({ user_eth, response });
                        res.json(JSON.stringify(balance))
                        // res.redirect('/index/' + user.username)
                        return false;
                        // res.redirect("/showdata)                 
                    }).catch(e => {
                        console.log(e)
                    })


                    // res.send(JSON.stringify(balance))
                }).then(() => {
                    console.log('complete_check_balance')
                }).catch(e => {
                    console.log(e)
                });
            });
        }
        function onAddressChange(e) {
            const walletAddress = req.headers.fromaddress;
            const id = req.headers.id;
            let tokenAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
            console.log("walletAddress =>", walletAddress)
            console.log("tokenAddress =>", tokenAddress)
            console.log("id =>", id)
            if (tokenAddress != "" && walletAddress != "") {
                getERC20TokenBalance(tokenAddress, walletAddress, id, (balance) => {
                })
            }
        }
        onAddressChange((resolve, reject) => {
            resolve(balance)
        })
    })

// <!--===============================================================================================-->
router.route('/balance_admin/:id/confirm')
    .post((req, res) => {
        web3.setProvider(new web3.providers.HttpProvider("https://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261"));
        async function getERC20TokenBalance(tokenAddress, walletAddress, string, callback) {
            var minABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
            let contract = new web3.eth.Contract(minABI, tokenAddress);
            let sw;
            contract.methods.balanceOf(walletAddress).call((error, balance) => {
                contract.methods.decimals().call((error, decimals) => {
                    balance = balance / (10 ** decimals);
                    console.log("decimals => ", decimals);
                    console.log("balance => ", balance, "PSU");
                    database.ref('users').child(string).once("value", snapshot => {
                        if (snapshot.exists()) { // check ????????????????????????
                            //console.log('Have_data')
                            database.ref('users').child(string).update({
                                // balance: (req.headers.money+toAddress2.balance),
                                balance: balance,
                            }).then(() => {
                                //res.json(JSON.stringify(balance))
                                console.log('push_perfect')
                                res.redirect('back');

                            }).catch(e => {
                                console.log(e)
                            })
                        }
                    })
                    // res.send(JSON.stringify(balance))
                }).then(() => {
                    console.log('complete_check_balance')
                }).catch(e => {
                    console.log(e)

                });
            });
        }
        async function onAddressChange(e) {
            const string = req.headers.result_test;
            // const string = req.headers.toaddress; // dataform ===> test_admin_textarea
            //const show_req = req.header.id;
            console.log("string", string)
            const walletAddress = string.match(/(\d){10}/gm);
            let tokenAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
            console.log("walletAddress =>", walletAddress)
            console.log("tokenAddress =>", tokenAddress)
            for (let i in walletAddress) {
                let response = await getReceiverWalletFromId(walletAddress[i])
                let wallet = response.val()
                console.log("wallet ===> ", wallet.address)
                if (tokenAddress != "" && wallet.address != "") {
                    getERC20TokenBalance(tokenAddress, wallet.address, string, (balance) => {
                    })
                }
            }
        }

        onAddressChange((resolve, reject) => {
            resolve(balance)
        })

    })

// <!--===============================================================================================-->

router.route('/getWalletById')
    .get((req, res) => {
        //const id = "5935512088"
        const id = req.headers.id;
        console.log("get", id)
        // for (let i in id) {
        database.ref('users').child(id).once("value", snapshot => {
            res.send(JSON.stringify({
                address: snapshot.val().address,
                privateKey: snapshot.val().privateKey,
            }))
        })
        //  }
    })

// <!--===============================================================================================-->
router.route('/sendadmin/:id')
    .get((req, res) => {
        res.render('sendadmin.html')
    })
router.route('/sendadmin/:id/confirm')
    .get((req, res) => {
        async function Tranfer() {
            // const id = req.headers.toaddress;

            const xx = req.headers;
            console.log('xx: ', xx)
            const string = req.headers.toaddress;
            console.log("string = >", string)
            var id = string.match(/(\d){10}/gm)
            console.log("id for text_area ===>", id)
            const fromAddress = req.headers.fromaddress;
            const money = req.headers.money;
            const privateKey = req.headers.privatekey;
            //const testvalue = req.headers.result;
            console.log("testvalue === >", req.header.value1)
            console.log("fromAddress =>", fromAddress)
            console.log("money =>", money)
            console.log("privateKey =>", privateKey)
            //console.log("totalvalue =>", totalvalue)
            web3.setProvider(new web3.providers.HttpProvider("https://kovan.infura.io/v3/37dd526435b74012b996e147cda1c261"));
            var abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './abi.json'), 'utf-8'));
            var count = await web3.eth.getTransactionCount(fromAddress);
            //var count = await Web3.eth.getTransactionCount(fromAddress,'pending');
            var contractAddress = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
            var contract = new web3.eth.Contract(abi, contractAddress, { from: fromAddress });
            var weiTokenAmount = web3.utils.toWei(String(money), 'ether');
            var privKey = Buffer.from(privateKey, 'hex');
            for (let i in id) {
                let response = await getReceiverWalletFromId(id[i]) //5935512088
                let wallet = response.val()
                var Transaction = {
                    "from": fromAddress,
                    "nonce": "0x" + (count++).toString(16),
                    "gasPrice": "0x003B9ACA00",
                    "gasLimit": "0x250CA",//151754+
                    "to": contractAddress,
                    "value": "0x0",
                    "data": contract.methods.transfer(wallet.address, weiTokenAmount).encodeABI(),
                    "chainId": 0x03
                };
                console.log("privKey = > ", privKey);
                const tx = new EthereumTx(Transaction, { chain: 'kovan' });
                tx.sign(privKey);
                var serializedTx = tx.serialize();
                console.log("serializedTx =>", serializedTx)
                var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
                console.log("receipt =>", receipt)
                //res.json(JSON.stringify(receipt.transactionHash))
                /*database.ref('users').child(id[i]).once("value", snapshot => {
                    if (snapshot.exists()) { // check ????????????????????????
                        console.log('Have_data')
                        database.ref('users').child(id[i]).update({
                            // balance: (req.headers.money+toAddress2.balance),
                            balance: req.headers.money,
                        }).then(() => {
                            console.log('push_perfect')
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                })*/
                // console.log("finish" + (i + 1))
            }

        }
        Tranfer().then((result) => {
            console.log(result)
        })

    })
// <!--===============================================================================================-->
router.route('/getProfileById')
    .get((req, res) => {
        const id = req.headers.id;
        console.log("id_toaddress", id)
        database.ref('users').child(id).once("value", snapshot => {
            if (snapshot.val()) {
                const data = snapshot.val().name.GetStaffDetailsResult.string
                //console.log("data", data)
                res.send(JSON.stringify({
                    id: data[0],
                    name: data[1],
                    lastName: data[2]
                }))
            } else {
                res.send(JSON.stringify({
                    id: '',
                    name: '',
                    lastName: ''
                }))
            }
        })
    })
// <!--===============================================================================================-->
router.route('/getProfileByIdadmin')
    .get((req, res) => {
        const id = req.headers.id;
        console.log("id_toaddress", id)
        database.ref('users').child(id).once("value", snapshot => {
            if (snapshot.val()) {
                // const data = snapshot.val().name
                const data1 = snapshot.val().name
                const data2 = snapshot.val().surname
                const data3 = snapshot.val().balance
                //console.log("data", data)
                res.send(JSON.stringify({
                    // id: data,
                    name: data1,
                    lastName: data2,
                    balance: data3
                }))
            } else {
                res.send(JSON.stringify({
                    //id: '',
                    name: '',
                    lastName: '',
                    balance: ''
                }))
            }
        })
    })
// <!--===============================================================================================-->

router.route('/getProfileforbalance') // ??????????????? ??????
    .get((req, res) => {
        const id = req.headers.id; // ???????????? ??????
        console.log("get", id)
        database.ref('users').child(id).once("value", snapshot => {
            if (snapshot.val()) {
                const data = snapshot.val().balance
                res.send(JSON.stringify(data))
            }
            //else {
            // console.log(err)
            // }
        })

    })
// <!--===============================================================================================-->
async function getReceiverWalletFromId(id) {
    console.log("id in getReceiverWalletFromId", id); //id ??? ??????????????? Toaddress ???????????????????
    return await database.ref('users').child(id).once("value")
    // console.log("getReceiverWalletFromId = >",id)
}

// <!--===============================================================================================-->
app.listen(5001, () => console.log('Server is ready!'))


// 791786F6D865B4FAFAC0E92A5961D0526AF0072EFA757D5E46E59A69EF63FF70

