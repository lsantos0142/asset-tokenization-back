import { Logger } from "@nestjs/common";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { readFileSync } from "fs";
import { contractAbi } from "smart_contracts/contract-abi";
import { compile } from "solc";
import Web3 from "web3";
import { CreateTokenizationDto } from "./dto/create-tokenization-dto";
import { TransferOwnershipDto } from "./dto/transfer-ownership.dto";

export class SmartContractsService {
    public readonly mnemonic: string;
    public readonly providerOrUrl: string;
    public readonly provider: HDWalletProvider;
    public readonly web3: Web3;

    constructor() {
        this.mnemonic = process.env.MNEMONIC;
        this.providerOrUrl =
            "https://goerli.infura.io/v3/87902c981be0460c94930d13b31b7eb0";

        this.provider = new HDWalletProvider({
            mnemonic: this.mnemonic,
            providerOrUrl: this.providerOrUrl,
        });

        this.web3 = new Web3(this.provider);
    }

    async createTokenization({ proposal }: CreateTokenizationDto) {
        const content = readFileSync(
            "./smart_contracts/Tokenization.sol",
            "utf8",
        );

        const input = {
            language: "Solidity",
            sources: {
                "Tokenization.sol": { content },
            },
            settings: {
                outputSelection: { "*": { "*": ["*"] } },
            },
        };

        /* 1. Get Ethereum Account */
        const [account] = await this.web3.eth.getAccounts();
        /* 2. Compile Smart Contract */
        const { contracts } = JSON.parse(compile(JSON.stringify(input)));
        const contract = contracts["Tokenization.sol"].AssetToken;
        /* 3. Extract Abi And Bytecode From Contract */
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;
        /* 4. Send Smart Contract To Blockchain */
        const { _address }: any = await new this.web3.eth.Contract(abi)
            .deploy({
                data: bytecode,
                arguments: [
                    proposal.user.walletAddress,
                    proposal.address,
                    proposal.usableArea,
                    proposal.registration,
                ],
            })
            .send({ from: account, gas: 10000000 });
        Logger.log("Contract Address => " + _address);
        Logger.log("Abi => " + JSON.stringify(abi));

        return _address;
    }

    async testMethods() {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            "0x0E8804e079B6bceCa009E75B453C0466c1fA5516",
            { from: account, gas: 10000000 },
        );

        return JSON.stringify(
            await NameContract.methods
                .percentageOwners("0x7E2CdEcA4cC308B5253118d7dC99B124EB3a0556")
                .call(),
        );
    }

    async transferOwnership({
        contractAddress,
        buyer,
        seller,
        isEffectiveOwnerTransfer,
        transferShares,
    }: TransferOwnershipDto) {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            contractAddress,
            { from: account, gas: 10000000 },
        );

        try {
            Logger.log(
                JSON.stringify(
                    await NameContract.methods
                        .transferOwnership(
                            transferShares,
                            seller,
                            buyer,
                            isEffectiveOwnerTransfer,
                        )
                        .send(),
                ),
            );
        } catch (exception) {
            throw exception;
        }
    }
}
