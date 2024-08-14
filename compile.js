const path = require('path');
const fs = require('fs');
const solc = require('solc')

const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol')
const source = fs.readFileSync(lotteryPath, 'UTF8');

var complierInput = {
    language: 'Solidity',
    sources: {
        'lottery.sol': {
            content: source
        }
    },
    settings: {
        optimizer:
        {
            enabled: true
        },
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

let output = JSON.parse(solc.compile(JSON.stringify(complierInput)));
module.exports = output
// `output` here contains the JSON output as specified in the documentation
// for (var contractName in output.contracts['lottery.sol']) {
//   console.log(
//     contractName +
//       ': ' +
//       output.contracts['lottery.sol'][contractName].evm.bytecode.object
//   );
// }