import { ForbiddenException, Logger } from "@nestjs/common";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { readFileSync } from "fs";
import { contractAbi } from "smart_contracts/contract-abi";
import { compile } from "solc";
import Web3 from "web3";
import { CreateCollateralDto } from "./dto/create-collateral.dto";
import { CreateTokenizationDto } from "./dto/create-tokenization.dto";
import { DeleteCollateralDto } from "./dto/delete-collateral.dto";
import { RegisterRentPaymentsDto } from "./dto/register-rent-payments.dto";
import { TransferOwnershipDto } from "./dto/transfer-ownership.dto";

export class SmartContractsService {
    public readonly mnemonic: string;
    public readonly providerOrUrl: string;
    public readonly provider: HDWalletProvider;
    public readonly web3: Web3;

    constructor() {
        this.mnemonic = process.env.MNEMONIC;
        this.providerOrUrl = process.env.INFURA_URL;

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

        try {
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
                .send({ from: account, gas: Number(process.env.GAS_VALUE) });
            Logger.log("Contract Address => " + _address);
            Logger.log("Abi => " + JSON.stringify(abi));
            return _address;
        } catch (exception) {
            throw new ForbiddenException(exception.message);
        }
    }

    async testMethods() {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            "0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005",
            { from: account, gas: Number(process.env.GAS_VALUE) },
        );
        this.web3.eth.handleRevert = true;
        return JSON.stringify(
            await NameContract.methods.getAllOwnersDetails().call(),
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
            { from: account, gas: Number(process.env.GAS_VALUE) },
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
            throw new ForbiddenException(exception.message);
        }
    }

    async createCollateral({
        bankWallet,
        sellerWallet,
        collateralShares,
        expirationDate,
        contractAddress,
    }: CreateCollateralDto) {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            contractAddress,
            { from: account, gas: Number(process.env.GAS_VALUE) },
        );

        try {
            Logger.log(
                JSON.stringify(
                    await NameContract.methods
                        .createCollateral(
                            bankWallet,
                            sellerWallet,
                            collateralShares,
                            expirationDate,
                        )
                        .send(),
                ),
            );
        } catch (exception) {
            throw new ForbiddenException(exception.message);
        }
    }

    async deleteCollateral({
        ownerWallet,
        bankWallet,
        collateralShares,
        expirationDate,
        contractAddress,
    }: DeleteCollateralDto) {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            contractAddress,
            { from: account, gas: Number(process.env.GAS_VALUE) },
        );

        try {
            Logger.log(
                JSON.stringify(
                    await NameContract.methods
                        .deleteCollateral(
                            ownerWallet,
                            bankWallet,
                            collateralShares,
                            expirationDate,
                        )
                        .send(),
                ),
            );
        } catch (exception) {
            throw new ForbiddenException(exception.message);
        }
    }

    async registerRentPayment({
        contractAddress,
        amount,
        paymentDate,
    }: RegisterRentPaymentsDto) {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            contractAddress,
            { from: account, gas: Number(process.env.GAS_VALUE) },
        );

        try {
            Logger.log(
                JSON.stringify(
                    await NameContract.methods
                        .registerRentPayment(
                            amount,
                            Math.round(paymentDate.getTime() / 1000),
                        )
                        .send(),
                ),
            );
        } catch (exception) {
            throw new ForbiddenException(exception.message);
        }
    }

    async getAllOwnersDetails(contractAddress: string) {
        const [account] = await this.web3.eth.getAccounts();

        const NameContract = new this.web3.eth.Contract(
            contractAbi as any, // "as any" because typescript does not recognize "signature"
            contractAddress,
            { from: account, gas: Number(process.env.GAS_VALUE) },
        );

        try {
            return await NameContract.methods.getAllOwnersDetails().call();
        } catch (exception) {
            Logger.log(exception);
            throw exception;
        }
    }
}
