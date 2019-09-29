In this tutorial you will learn how to

1. create a metaverse wallet
2. Integrate wallet into your dapp
3. Send transactions programatically
4. Create a metaverse Avatar

Explanation
How metaverse wallets work
transactions, transaction fee, utxo, mnemonics, ETP

ETP is the native currency of the Metaverse blockchain. To send and receive ETP you need a Metaverse wallet.

Key concepts in this tutorial:

ETP uses Bitcoins UTXO based model. This means....

Every time you receive a transaction, it becomes a UTXO.
Every time you send a transaction, you collect UTXO's into a transaction input,
which becomes a UTXO on the receivers end, and the change left over becomes a UTXO on your end.

Don't worry. Metaverse's library manages UTXO's for you

For more information on UTXO's look here https://komodoplatform.com/whats-utxo/

deterministic wallet generated by memnonic code words



Create front end
<html>
create new wallet
import wallet
display balance

Send ETP

</html>

NODEJS
Create wallet with nodejs

Get Testnet ETP

Get Balance
SendETP

Build dapp
build metaverse.min.js
add source to webpage
Connect Wallet and Front End
connect elements to functions