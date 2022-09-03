import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { readFileSync } from 'fs';
import { compile } from 'solc'

@Injectable()
export class SmartContractsService {

    async createTokenization(effectiveOwner: string, assetAddress: string, assetUsableArea: number, assetId: number): Promise<string> {


        const mnemonic = process.env.MNEMONIC; 
        const providerOrUrl = 'https://rinkeby.infura.io/v3/87902c981be0460c94930d13b31b7eb0';
        const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
        const web3 = new Web3(provider);

        const content = readFileSync('./smart_contracts/Tokenization.sol', 'utf8');

        const input = {
            language: 'Solidity',
            sources: {
                'Tokenization.sol': { content }
            },
            settings: {
                outputSelection: { '*': { '*': ['*'] } }
            }
        };

        /* 1. Get Ethereum Account */
        const [account] = await web3.eth.getAccounts();
        /* 2. Compile Smart Contract */
        const {contracts} = JSON.parse(
            compile(JSON.stringify(input))
        );
        const contract = contracts['Tokenization.sol'].AssetToken;
        /* 3. Extract Abi And Bytecode From Contract */
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;
        /* 4. Send Smart Contract To Blockchain */
        const { _address }: any = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [effectiveOwner, assetAddress, assetUsableArea, assetId]
        })
        .send({from: account, gas: 10000000 });
        Logger.log("Contract Address =>", _address);

        return "lol";
    }
}
