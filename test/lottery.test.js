const assert = require('assert')
const ganache = require('ganache-cli');
const { describe, it, beforeEach } = require('mocha');
const Web3 = require('web3')
const web3 = new Web3(ganache.provider() || "http://localhost:8545");
const { contracts } = require("../compile")

let fetchedAccounts;
let lottery;

beforeEach(async () => {
    fetchedAccounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(contracts['lottery.sol'].Lottery.abi)
        .deploy({
            data: contracts['lottery.sol'].Lottery.evm.bytecode.object
        })
        .send({
            from: fetchedAccounts[0], gas: "1000000"
        })
})

describe("Lottery Contract", () => {
     
    it("It deployes a contract", () => {
        assert.ok(lottery.options.address)
    })

    it("It allows one account to enter",async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0])
        assert.equal(1, players.length)
    })

    it("It allows multiple accounts to enter",async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        })

        await lottery.methods.enter().send({
            from: fetchedAccounts[1],
            value: web3.utils.toWei('0.2', 'ether')
        })

        await lottery.methods.enter().send({
            from: fetchedAccounts[2],
            value: web3.utils.toWei('0.2', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0])
        assert.equal(fetchedAccounts[1], players[1])
        assert.equal(fetchedAccounts[2], players[2])
        assert.equal(3, players.length)
    })

    it('Requires a minimum amount of ether to enter',async ()=>{
        try {
            await lottery.methods.enter.send({
                from: fetchedAccounts[0],
                value: 0
            })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('Only manager can pick winner',async ()=>{
        try {
            await lottery.methods.pickWinner.send({
                from: fetchedAccounts[1]
            })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('sends money to the winner and resets array', async ()=>{
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('2','ether')
        });

        const initialBalance = await web3.eth.getBalance(fetchedAccounts[0]);
        await lottery.methods.pickWinner().send({
            from: fetchedAccounts[0]
        })

        const finalBalance = await web3.eth.getBalance(fetchedAccounts[0]);

        const differece = finalBalance - initialBalance;
        assert(differece > web3.utils.toWei('1.8','ether'))
    })

})
