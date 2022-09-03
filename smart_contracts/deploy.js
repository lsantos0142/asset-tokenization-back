/* COMPILE AND DEPLOY CONTRACT */
const fs = require("fs");
const path = require("path");
const solc = require("solc");
const Web3 = require("Web3");
var Contract = require("web3-eth-contract");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic =
  "tongue spend random diagram body fish trouble rotate upon check safe garment";
const providerOrUrl =
  "https://rinkeby.infura.io/v3/87902c981be0460c94930d13b31b7eb0";

const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
const web3 = new Web3(provider);

const content = fs.readFileSync("./Tokenization.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Tokenization.sol": { content },
  },
  settings: {
    outputSelection: { "*": { "*": ["*"] } },
  },
};

async function deploy() {
  /* 1. Get Ethereum Account */
  const [account] = await web3.eth.getAccounts();
  /* 2. Compile Smart Contract */
  const { contracts } = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = contracts["Tokenization.sol"].AssetToken;
  /* 3. Extract Abi And Bytecode From Contract */
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  /* 4. Send Smart Contract To Blockchain */
  const { _address } = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [],
    })
    .send({ from: account, gas: 1000000 });
  console.log("Contract Address =>", _address);

  // var contract_test = new web3.eth.Contract(abi, "0x0049DE16f25327AB911be37fF031184Ef22A9627");

  // // console.log(await contract_test.methods.changeName("teste").send({from: "0xFAaA90Abfde4668eCE05ae694674e01DC8C7072c"}))
  // console.log(await contract_test.methods.showName().call())
}

deploy();
