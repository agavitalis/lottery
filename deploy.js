const HDWalletProcider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { contracts } = require("./compile")

const provider = new HDWalletProcider(
    'call glow acoustic vintage front ring trade assist shuffle mimic volume reject',
//    'kiss advance ketchup fee hurt curtain left famous ramp effort squirrel video',
    'https://rinkeby.infura.io/v3/b5f7681be5a04c679ca85b77def41eef'
)

const web3 = new Web3(provider)

const deploy = async()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy fron account:', accounts[0])
    const result = await new web3.eth.Contract(contracts['lottery.sol'].lottery.abi)
    .deploy({
        data: contracts['lottery.sol'].lottery.evm.bytecode.object
    })
    .send({
        from: accounts[0], gas: "1000000"
    })

    console.log('contract deployed at:', result.options.address)
}

deploy();