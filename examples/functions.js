let blockchain = require('../mvs-blockchain-js')({

    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var wallet
var mnemonic = "van juice oak general lyrics gravity hammer shield over eager crew volume survey join lonely purchase kitten artwork mass cousin process mixture add knife"
var addresses
var balances

run()

async function run(){
  console.log("Getting Addresses..............")
  await createWallet()
  console.log(addresses)

  console.log("Getting Balances..............")
  balances = await getBalances()
  console.log(balances)

  console.log("Sending ETP..............")
  let amountToSend = 10000000
  //await sendETP(amountToSend)
  console.log("ETP Sent")

  console.log("Depositing ETP............")
  let amountToDeposit = 10000
  let duration = 20
  //await depositETP(amountToDeposit,duration)
  console.log("ETP deposited")

  console.log("Registering Avatar............")
  let avatarName = "testguy3"
  let avatarAddress = wallet.getAddress(0)
  //await registerAvatar(avatarName,avatarAddress)
  console.log("avatar " + avatarName + " Registered to " + avatarAddress)

  console.log("getting Avatar Info......")

  let avatarInfo = await getAvatarInfo("Tal")
  console.log(avatarInfo)

  console.log("Issuing MST.............")
  let issuingAddress = wallet.getAddress(0),
      symbol = 'COOOL',
      max_supply = 100000,
      precision = 8,
      issuer = 'testguy3',
      description = 'cool asset is cool';
  //await issueMST(issuingAddress,symbol,max_supply,precision,issuer,description)

  console.log("Transferring MST.............")
  var target = {
      "COOOL": 1
  };
  await sendMST(target)
  console.log("MST Sent")


  console.log("Registering MIT................")


  let MITsymbol = "testar2"
  let avatar = "testguy3"
  let content = "some test content"
  //await issueMIT(avatar,MITsymbol,content)

  console.log("MIT Registered")


  console.log("Transferring MIT................")

  let MITToSend = "testar"
  let sender_avatar = "testguy3"
  let recipient_avatar = "Tal"
  await sendMIT(sender_avatar,recipient_avatar,MITToSend)

}


async function createWallet() {
  wallet  = await Metaverse.wallet.fromMnemonic(mnemonic,'testnet')

  addresses = await getAddresses()
}

async function getAddresses() {
  addresses = wallet.getAddresses()
  console.log("Addresses:  ")

  return(addresses)
  //let balances = await blockchain.balance.addresses(utxo, wallet.getAddresses(), height)
}



async function getBalances(){


  let height = await blockchain.height()
  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  console.log(txs)
  let utxo = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())
  let balances = await blockchain.balance.all(utxo, wallet.getAddresses(), height)

  return balances

}

async function sendETP(amount){

  var target = {
      ETP: amount
  };

  var recipient_address = "MVbtobP4m44AKsx5PqBbtrBUdycNHxM3eQ";

  let height = await blockchain.height()
  let txs = await blockchain.addresses.txs(addresses)

  //Get all utxo
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())

  //Collect utxo for given target
  let result = await Metaverse.output.findUtxo(utxos, target, height)

  let tx = await  Metaverse.transaction_builder.send(result.utxo, recipient_address, undefined, target, result.utxo[0].address, result.change)

  tx = await wallet.sign(tx)
  tx = await tx.encode()
  tx = await blockchain.transaction.broadcast(tx.toString('hex'))

  console.log("tx hash: ")

  //log amount ETP sent to WHO
  console.log(tx)
}

async function depositETP(quantity,duration) {

  var recipient_address = "MDyq6w7RqXPF9F5SSrKpTrharr8wF1D4gX";
  var change_address = "MDc9rsRr5Ukgro4mu89G2Spdts5aACRJdb";

  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())

  let result = await Metaverse.output.findUtxo(utxos, {
      'ETP': quantity
  }, Metaverse.constants.FEE.DEFAULT)

  let tx = await Metaverse.transaction_builder.deposit(result.utxo, recipient_address, quantity, duration, change_address, result.change, undefined, 'testnet')
  tx = await tx.encode()
  tx = await blockchain.transaction.broadcast(tx.toString('hex'))
  console.log(tx)

}

async function getUTXOs(){
  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())
  return(utxos)
}

async function registerAvatar(avatar_name,avatar_address) {

    let change_address = avatar_address
    console.log(avatar_address)
    let height = await blockchain.height()
    let txs = await blockchain.addresses.txs([avatar_address])
    let utxos = await Metaverse.output.calculateUtxo(txs.transactions, [avatar_address]) //Get all utxo for the avatar address
    let result = await Metaverse.output.findUtxo(utxos, {}, height, 100000000) //Collect utxo to pay for the fee of 1 ETP
    let tx = await Metaverse.transaction_builder.issueDid(result.utxo, avatar_address, avatar_name, change_address, result.change, 80000000, 'testnet')
    tx= await wallet.sign(tx)
    tx = await tx.encode()
    tx = await tx.toString('hex')
    tx = await blockchain.transaction.broadcast(tx)
    console.log(tx)
}

async function issueMST(issuingAddress,symbol,max_supply,precision,issuer,description){
  console.log("issuingAddress " + issuingAddress)
  console.log("symbol " + symbol)
  console.log("max_supply " + max_supply)
  console.log("precision " + precision)

  console.log("issuer " + issuer)
  console.log("description " + description)

  var recipient_address = issuingAddress;
  var change_address = issuingAddress;

  let height = await blockchain.height()
  console.log(issuingAddress)

  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()) //Get all utxo
  let result = await Metaverse.output.findUtxo(utxos, {}, height, 1000000000) //Collect utxo to pay for the fee of 10 ETP
  let tx = await Metaverse.transaction_builder.issueAsset(result.utxo, recipient_address, symbol, max_supply, precision, issuer, description, 0,false, change_address, result.change,true,0,'testnet',null,undefined)
  tx = await wallet.sign(tx)
  tx = await tx.encode()
  tx = await tx.toString('hex')
  tx = await blockchain.transaction.broadcast(tx)

  console.log(tx);
}

async function sendMST(target){
  let recipient_address = "t72Uc1k4EP4PztRgnDnxGZ2AmgEDj7rVVn"
  change_address = wallet.getAddress(0)
  let height = await blockchain.height()
  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()) //Get all utxo
  let result = await Metaverse.output.findUtxo(utxos, target, height) //Collect utxo for given target
  let tx = await Metaverse.transaction_builder.send(result.utxo, recipient_address, undefined, target, change_address, result.change)
  tx = await wallet.sign(tx)
  tx = await tx.encode()
  tx = await blockchain.transaction.broadcast(tx.toString('hex'))
  console.log(tx)
}

async function issueMIT(issuer_avatar,symbol,content){

  var target = {
    ETP: 10000
  };

  let recipient_address =  wallet.getAddress(0)
  let change_address = wallet.getAddress(0)

  let height = await blockchain.height()
  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()) //Get all utxo
  let result = await Metaverse.output.findUtxo(utxos, {}, height,10000) //Collect utxo to pay fee of 0.0001 ETP
  let tx = await Metaverse.transaction_builder.registerMIT(result.utxo, recipient_address, issuer_avatar, symbol, content, change_address, result.change)
  tx = await wallet.sign(tx)
  tx = await tx.encode()
  tx = await blockchain.transaction.broadcast(tx.toString('hex'))
                // .then(tx=>tx.toString('hex'))
  console.log(tx)

}

async function sendMIT(sender_avatar,recipient_avatar,symbol){


  let recipient_address = getAvatarAddress(recipient_avatar)
  let change_address = getAvatarAddress(sender_avatar)
  let height = await blockchain.height()
  let txs = await blockchain.addresses.txs(wallet.getAddresses())
  let utxos = await Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()) //Get all utxo
  let results = await Promise.all([
                    Metaverse.output.findUtxo(utxos, {}, height),
                    Metaverse.output.filter(utxos, {
                        type: "mit"
                    })
                ])
  //console.log(results)
  //console.log(results[0])
  console.log(results[0].utxo.concat(results[1]))
  let tx = await Metaverse.transaction_builder.transferMIT(results[0].utxo.concat(results[1]), sender_avatar, recipient_address, recipient_avatar, symbol, change_address, results[0].change)

  tx = await wallet.sign(tx)

  tx = await tx.encode()

  tx = await blockchain.transaction.broadcast(tx.toString('hex'))

  console.log(tx)
}

async function getAvatarInfo(avatar){
  let avatarInfo = await blockchain.avatar.get(avatar)
  return avatarInfo

}

async function getAvatarAddress(avatar){
  let avatarInfo = await blockchain.avatar.get(avatar)
  return avatarInfo.address
}








//   var tx = new Metaverse.transaction();
//   tx.version=2;
//   tx.inputs = [{
//         "address": "MV1HEd7A4bCnLXhxXLHgWB2rurtS7xVWJf",
//         "previous_output": {
//             "address": "MV1HEd7A4bCnLXhxXLHgWB2rurtS7xVWJf",
//             "hash": "c9c32b0723a57ce087f42df5bb5f98db404a886ef651842f844d59eca6412b27",
//             "index": 0
//         },
//         "script": "",
//         "sequence": 4294967295
//     },
//     {
//         "address": "MKXYH2MhpvA3GU7kMk8y3SoywGnyHEj5SB",
//         "previous_output": {
//             "address": "MKXYH2MhpvA3GU7kMk8y3SoywGnyHEj5SB",
//             "hash": "707cd4f639e292bd7cbf15c40e9c86d3bbec4c505ca09f6a72eded8313a927be",
//             "index": 1
//         },
//         "script": "",
//         "sequence": 4294967295
//     }
// ];
// tx.outputs = [{
//         "index": 0,
//         "address": "MVpxH8aAa3BAXvbdqUUJwEP6s2ajGKKtyd",
//         "script_type": "pubkeyhash",
//         "value": 729995,
//         "attachment": {
//             type: 0,
//             version: 1
//         }
//     },
//     {
//         "index": 1,
//         "address": "MV1HEd7A4bCnLXhxXLHgWB2rurtS7xVWJf",
//         "script_type": "pubkeyhash",
//         "value": 619995,
//         "attachment": {
//                           type: 0,
//                           version: 1
//                       }
//     }];
//
//   var stx = await wallet.sign(tx);
//
//   var signed_raw_tx = await stx.encode()
//
//   var signed_tx = signed_raw_tx.toString('hex');
//
//
//
//
//       console.log(wallet.getAddress(1))
//       console.log("MV1HEd7A4bCnLXhxXLHgWB2rurtS7xVWJf");
//
//       console.log(signed_tx)
//       console.log("0200000002272b41a6ec594d842f8451f66e884a40db985fbbf52df487e07ca523072bc3c9000000006b483045022100b71e952543ad8d937b9460a0d690132dbc8977f077ced43c4914665698868d5102202547633e9a914b68946db1b6007fad1b35e2c22f6dd014caf45da3860433b4c30121035550f8c20e914c4989dcd3521dccd4def479ff8d8e147ecf366cbd196e658712ffffffffbe27a91383eded726a9fa05c504cecbbd3869c0ec415bf7cbd92e239f6d47c70010000006b483045022100e5067916c7447bca7bb339d1e48ca54e6c84a21c244c9efb05904f71006ad2df02200a72348fb082c42bf707cc2e12288757e0f7cb81fdcdfea0ac21dc2c1e4855910121034593f54b073ed6a3728056d0f6595d614c717c639a9301761de7c8ef5d5fe1b4ffffffff028b230b00000000001976a914f087200b95bd043a134a0cead903e0a3600d79eb88ac0100000000000000db750900000000001976a914e782fbba93466771c63d7a9fcc54d85efa26fd3488ac010000000000000000000000");
//
//
//       var wif = 'L4gHAbCrWqTneuWJVmjLjFQck7jtkBQzGvmbvvJJEs21LJy1Tp2h';
//       console.log(wif)
//       console.log(Metaverse.wallet.getNodeFromWIF(wif).toWIF());
// }
