'use strict'
const seelejs = require('seele.js')
const randservice = require('../rand/rand')
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);
// const fs = require('fs')
// SeeleDice2ABI is the input ABI used to generate the binding from.
const SeeleDice2ABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"croupier\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"rollUnder\",\"type\":\"uint8\"},{\"name\":\"commit\",\"type\":\"bytes32\"},{\"name\":\"r\",\"type\":\"bytes32\"},{\"name\":\"s\",\"type\":\"bytes32\"},{\"name\":\"v\",\"type\":\"uint8\"}],\"name\":\"placeBet\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"maxProfit\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"beneficiary\",\"type\":\"address\"},{\"name\":\"withdrawAmount\",\"type\":\"uint256\"}],\"name\":\"withdrawFunds\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"amount\",\"type\":\"uint256\"},{\"name\":\"rollUnder\",\"type\":\"uint8\"}],\"name\":\"getDiceWinAmount\",\"outputs\":[{\"name\":\"winAmount\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"pure\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"lockedInBets\",\"outputs\":[{\"name\":\"\",\"type\":\"uint128\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"reveal\",\"type\":\"bytes\"},{\"name\":\"blockHash\",\"type\":\"bytes32\"}],\"name\":\"settleBet\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newCroupier\",\"type\":\"address\"}],\"name\":\"setCroupier\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_maxProfit\",\"type\":\"uint256\"}],\"name\":\"setMaxProfit\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"c\",\"type\":\"address\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"FailedPayment\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Payment\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"rollUnder\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"rollUnder\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"
// SeeleDice2Bin is the compiled bytecode used for deploying new contracts.
const SeeleDice2Bin = `0x60806040526040516020806118ee8339810180604052810190808051906020019092919050505033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100a0573390505b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600560ff16606460ff1664e8d4a51000028115156100fb57fe5b04600081905550506117dc806101126000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636b5c5f39146100b15780636bdebcc91461010857806377b7572c1461011f5780638da5cb5b14610179578063b539cd55146101d0578063c1075329146101fb578063cb67284d14610248578063df88126f14610296578063e7c25c35146102e5578063f8bb201c1461032e578063fbd668a914610371575b005b3480156100bd57600080fd5b506100c661039e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561011457600080fd5b5061011d6103c4565b005b610177600480360381019080803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803560ff1690602001909291905050506105de565b005b34801561018557600080fd5b5061018e610aee565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101dc57600080fd5b506101e5610b14565b6040518082815260200191505060405180910390f35b34801561020757600080fd5b50610246600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610b1a565b005b34801561025457600080fd5b5061028060048036038101908080359060200190929190803560ff169060200190929190505050610d11565b6040518082815260200191505060405180910390f35b3480156102a257600080fd5b506102ab610eb1565b60405180826fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102f157600080fd5b5061032c6004803603810190808035906020019082018035906020019190919293919293908035600019169060200190929190505050610ed3565b005b34801561033a57600080fd5b5061036f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506114d4565b005b34801561037d57600080fd5b5061039c60048036038101908080359060200190929190505050611603565b005b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001807f4f6e6c794f776e6572206d6574686f64732063616c6c6564206279206e6f6e2d81526020017f6f776e65722e000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6000600160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff161415156105a3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260488152602001807f416c6c20626574732073686f756c642062652070726f6365737365642028736581526020017f74746c6564206f7220726566756e64656429206265666f72652073656c662d6481526020017f657374727563742e00000000000000000000000000000000000000000000000081525060600191505060405180910390fd5b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6000806000806002600089600019166000191681526020019081526020016000209350600084600001541415156106a3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001807f4265742073686f756c6420626520696e20612027636c65616e2720737461746581526020017f2e0000000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b3492506298968083101580156106be575064e8d4a510008311155b1515610758576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602d8152602001807f4265742073686f756c642062652077697468696e2072616e67655b4d494e5f4281526020017f45542c204d41585f4245545d2e0000000000000000000000000000000000000081525060400191505060405180910390fd5b84915060018260ff1611151561076f57601b850191505b600188838989604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af11580156107e6573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156108b4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f4543445341207369676e6174757265206973206e6f742076616c69642e00000081525060200191505060405180910390fd5b6108be838a610d11565b90506000548301811115151561093c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f6d617850726f666974206c696d69742076696f6c6174696f6e2e00000000000081525060200191505060405180910390fd5b80600160008282829054906101000a90046fffffffffffffffffffffffffffffffff160192506101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff1602179055503073ffffffffffffffffffffffffffffffffffffffff1631600160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1611151515610a55576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43616e6e6f74206166666f726420746f206c6f73652074686973206265742e0081525060200191505060405180910390fd5b828460000181905550888460010160006101000a81548160ff021916908360ff160217905550438460010160016101000a81548164ffffffffff021916908364ffffffffff160217905550338460010160066101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050505050505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60005481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c05576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001807f4f6e6c794f776e6572206d6574686f64732063616c6c6564206279206e6f6e2d81526020017f6f776e65722e000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff163181600160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff160111151515610cc6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f4e6f7420656e6f7567682066756e64732e00000000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610d0c573d6000803e3d6000fd5b505050565b600080600560ff168360ff1610158015610d325750606060ff168360ff1611155b1515610dcc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603b8152602001807f57696e2070726f626162696c697479206f7574206f662072616e67655b4d494e81526020017f5f524f4c4c554e4445522c204d41585f524f4c4c554e4445525d2e000000000081525060400191505060405180910390fd5b6064600160ff168502811515610dde57fe5b049050620f4240811015610df357620f424090505b838111151515610e91576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001807f42657420646f65736e2774206576656e20636f76657220686f7573652065646781526020017f652e00000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b8260ff16606460ff1682860302811515610ea757fe5b0491505092915050565b600160009054906101000a90046fffffffffffffffffffffffffffffffff1681565b6000806000806000806000806000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610fcc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c8152602001807f4f6e6c7943726f7570696572206d6574686f64732063616c6c6564206279206e81526020017f6f6e2d63726f75706965722e000000000000000000000000000000000000000081525060400191505060405180910390fd5b8b8b6040518083838082843782019150509250505060405180910390209850600260008a6000191660001916815260200190815260200160002097508760010160019054906101000a900464ffffffffff1664ffffffffff16965086431115156110c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001807f736574746c6542657420696e207468652073616d6520626c6f636b206173207081526020017f6c6163654265742c206f72206265666f72652e0000000000000000000000000081525060400191505060405180910390fd5b60fa60ff1687014311151515611168576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001807f426c6f636b686173682063616e2774206265207175657269656420627920455681526020017f4d2e00000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b896000191687406000191614151561117f57600080fd5b876000015495508760010160009054906101000a900460ff1694508760010160069054906101000a900473ffffffffffffffffffffffffffffffffffffffff169350600088600001819055508b8b8b604051602001808484808284378201915050826000191660001916815260200193505050506040516020818303038152906040526040518082805190602001908083835b6020831015156112375780518252602082019150602081019050602083039250611212565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902092506001606460ff16846001900481151561127b57fe5b060191506112898686610d11565b905080600160008282829054906101000a90046fffffffffffffffffffffffffffffffff160392506101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff1602179055508460ff1682101561144f578373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501561137d578373ffffffffffffffffffffffffffffffffffffffff167fd4f43975feb89f48dd30cabbb32011045be187d1e11c8ea9faa43efc35282519826040518082815260200191505060405180910390a26113cc565b8373ffffffffffffffffffffffffffffffffffffffff167fac464fe4d3a86b9121261ac0a01dd981bfe0777c7c9d9c8f4473d31a9c0f9d2d826040518082815260200191505060405180910390a25b7f4d1dda173b8c0fcc123ee7c5cb331e3731e5e2dcde5bcc763c40ce953f81f8bf84868484604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018460ff16815260200183815260200182815260200194505050505060405180910390a16114c6565b7f655dc916988b3746402901627e8485408dccba300f8396bcc750826ca9a92182848684604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018360ff168152602001828152602001935050505060405180910390a15b505050505050505050505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001807f4f6e6c794f776e6572206d6574686f64732063616c6c6564206279206e6f6e2d81526020017f6f776e65722e000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001807f4f6e6c794f776e6572206d6574686f64732063616c6c6564206279206e6f6e2d81526020017f6f776e65722e000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b600560ff16606460ff1664e8d4a510000281151561170857fe5b0481111515156117a6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001807f6d617850726f6669742073686f756c6420626520612073616e65206e756d626581526020017f725b302c204d41585f50524f4649545d2e00000000000000000000000000000081525060400191505060405180910390fd5b80600081905550505600a165627a7a72305820e75ff8b751ebf1515d57851495a3eb97986cfbf025f492dced6716837819b25200290000000000000000000000006d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451`

let client
if (typeof document !== 'undefined' && document.domain){
    client = new seelejs(document.domain + '/seelens')
} else{
    client = new seelejs('http://117.50.20.218:8037')
}

class Dice2{
    /** 
     * @example
     * this.SeelediceABI = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.ABI').toString()
     * this.SeeleDiceBin = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.Bytecode').toString()
     * this.Properties = {
     *     'croupier' : client.sendSync("generatePayload", this.SeelediceABI, "croupier", []),
     *     'owner' : client.sendSync("generatePayload", this.SeelediceABI, "owner", []),
     *     'maxProfit' : client.sendSync("generatePayload", this.SeelediceABI, "maxProfit", []),
     *     'lockedInBets' : client.sendSync("generatePayload", this.SeelediceABI, "lockedInBets", []),
     * }
     */

    constructor(){
        this.ContractAddress = "0xbc46614da8e742da7c23df823802a55141e20002"
        this.SeeleDiceABI = SeeleDice2ABI
        this.SeeleDiceBin = SeeleDice2Bin
        this.Properties = {
            croupier: '0x6b5c5f39',
            owner: '0x8da5cb5b',
            maxProfit: '0xb539cd55',
            lockedInBets: '0xdf88126f',
            destory : '0x6bdebcc9',
        }
    }

    GetCroupier(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.croupier, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let croupier = data.result
        return {"croupier" : "0x" + croupier.substring(croupier.length-40)}
    }

    GetOwner(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.owner, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let owner = data.result
        return {"owner" : "0x" + owner.substring(owner.length-40)}
    }

    GetMaxProfit(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.maxProfit, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let maxProfit = data.result
        return parseInt(maxProfit, 16)
    }

    GetLockedInBets(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.lockedInBets, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let lockedInBets = data.result
        return parseInt(lockedInBets, 16)
    }

    GetDiceWinAmount(bet, rollUnder){
        let payload = client.sendSync("generatePayload", this.SeeleDiceABI, "getDiceWinAmount", [bet.toString(), rollUnder.toString()])
        let data = client.sendSync("call", this.ContractAddress, payload, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let payout = data.result
        return parseInt(payout, 16)
    }

    async PlaceBet(keypair, args){
        let rand = randservice.GetRand(), self = this
        let [payload, nonce] = await Promise.all([
            client.generatePayload(self.SeeleDiceABI, 'placeBet', [args.RollUnder.toString(), rand.commit, rand.r, rand.s, rand.v]),
            client.getAccountNonce(keypair.PublicKey),
        ])
        
        let rawTx = {
            "From" : keypair.PublicKey,
            "To" : self.ContractAddress,
            "Amount" : args.Bet || 0,
            "AccountNonce" : nonce,
            "GasPrice":args.GasPrice || 1,
            "GasLimit":args.GasLimit || 3000000,
            "Timestamp":0,
            "Payload": payload
        }
        let tx = await client.generateTx(keypair.PrivateKey, rawTx)
        // console.log(JSON.stringify(tx))

        let result = await client.addTx(tx)
        if (result){
            return {'commit' : rand.commit, 'txHash' : tx.Hash}
        }

        Promise.resolve(result)
    }

    async SettleBet(commit, txHash){
        let reveal = randservice.bets.get(commit), self = this
        // let filterTxByHashTxHash = (txHash) => {
        //     return client.getTransactionByHash(txHash).then(tx =>{
        //         if (tx.status !== 'block'){
        //             return filterTxByHashTxHash(txHash)
        //         }
        //         return tx
        //     }).catch(err => {
        //         console.log("filterTxByHashTxHash err")
        //         console.log(err)
        //         try {
        //             let errmsg = JSON.parse(err.message)
        //             if (errmsg.includes('leveldb: not found')) {
        //                 return filterTxByHashTxHash(txHash)
        //             }
        //         } catch (err1) {
        //             console.log(err1)
        //             Promise.reject(err1)
        //         }
        //     })
        // }
        let betTx = await this.filterTxByHashTxHash(txHash)
        // console.log(JSON.stringify(betTx))
        let [payload, nonce] = await Promise.all([
            client.generatePayload(self.SeeleDiceABI, 'settleBet', [reveal, betTx.blockHash]),
            client.getAccountNonce(randservice.publickey),
        ])

        let rawTx = {
            "From" : randservice.publickey,
            "To" : self.ContractAddress,
            "Amount" : 0,
            "AccountNonce" : nonce,
            "GasPrice": 1,
            "GasLimit": 3000000,
            "Timestamp":0,
            "Payload": payload
        }
        let tx = await client.generateTx(randservice.privatekey, rawTx)
        // console.log(JSON.stringify(tx))

        let result = await client.addTx(tx)
        if (result){
            return {'txHash':tx.Hash,'bet':betTx.transaction.amount}
        }

        Promise.resolve(result)
    }

    async GetReceipt(txHash, bet) {
        let settleTx = await this.filterTxByHashTxHash(txHash)
        let receipt = await client.getReceiptByTxHash(txHash, this.SeeleDiceABI)
        // console.log(receipt)
        if (receipt.failed){
            Promise.reject(receipt.result)
        }

        let log, payout
        // winAction
        if (receipt.logs.length == 2){
            log = JSON.parse(receipt.logs[1])
            payout = log.Args[3]
        } else {
            log = JSON.parse(receipt.logs[0])
        }
        
        let block = await client.getBlock(settleTx.blockHash, -1, false)
        return {
            "Time":new Date(block.header.CreateTimestamp*1000),
            "Bettor":log.Args[0],
            "RollUnder":log.Args[1],
            "Bet":bet,
            "Roll":log.Args[2],
            "Payout":payout,
            "Event":log.Event,
        }
    }

    async Roll(keypair, args){
        let betData = await this.PlaceBet(keypair, args)
        // console.log("PlaceBet success!")
        let settleData = await this.SettleBet(betData.commit, betData.txHash)
        // console.log("SettleBet success!")
        return this.GetReceipt(settleData.txHash, settleData.bet)
    }

    filterTxByHashTxHash(txHash){
        let self = this
        return client.getTransactionByHash(txHash).then(tx =>{
            if (tx.status !== 'block'){
                return self.filterTxByHashTxHash(txHash)
            }
            return tx
        }).catch(err => {
            console.log("filterTxByHashTxHash err")
            console.log(err)
            try {
                let errmsg = JSON.parse(err.message)
                if (errmsg.includes('leveldb: not found')) {
                    return self.filterTxByHashTxHash(txHash)
                }
            } catch (err1) {
                console.log(err1)
                Promise.reject(err1)
            }
        })
    }
}

module.exports = new Dice2()