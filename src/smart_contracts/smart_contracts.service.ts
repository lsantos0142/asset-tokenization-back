import { Injectable, Logger } from "@nestjs/common";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { readFileSync } from "fs";
import { compile } from "solc";
import { CreateOwnershipDto } from "src/tokenized-asset/dto/create-ownership.dto";
import { TokenizedAssetService } from "src/tokenized-asset/tokenized-asset.service";
import Web3 from "web3";
import { CreateTokenizationDto } from "./dto/create-tokenization-dto";

@Injectable()
export class SmartContractsService {
    constructor(
        private readonly tokenizedAssetService: TokenizedAssetService,
    ) {}

    async createTokenization(createTokenizationDto: CreateTokenizationDto) {
        const {
            assetAddress,
            registration,
            assetUsableArea,
            effectiveOwner,
            userId,
        } = createTokenizationDto;

        const mnemonic = process.env.MNEMONIC;
        const providerOrUrl =
            "https://rinkeby.infura.io/v3/87902c981be0460c94930d13b31b7eb0";
        const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
        const web3 = new Web3(provider);

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
        const [account] = await web3.eth.getAccounts();
        /* 2. Compile Smart Contract */
        const { contracts } = JSON.parse(compile(JSON.stringify(input)));
        const contract = contracts["Tokenization.sol"].AssetToken;
        /* 3. Extract Abi And Bytecode From Contract */
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;
        /* 4. Send Smart Contract To Blockchain */
        const { _address }: any = await new web3.eth.Contract(abi)
            .deploy({
                data: bytecode,
                arguments: [
                    effectiveOwner,
                    assetAddress,
                    assetUsableArea,
                    registration,
                ],
            })
            .send({ from: account, gas: 10000000 });
        Logger.log("Contract Address => " + _address);
        Logger.log("Abi => " + JSON.stringify(abi));

        const createOwnershipData: CreateOwnershipDto = {
            isEffectiveOwner: true,
            percentageOwned: 1,
            tokenizedAsset: {
                usableArea: assetUsableArea,
                registration: registration,
                contractAddress: _address,
                address: assetAddress,
                deed: "base64",
            },
        };

        const savedUserToAsset =
            await this.tokenizedAssetService.createUserToAsset(
                createOwnershipData,
                userId,
            );

        return savedUserToAsset.tokenizedAsset.contractAddress;
    }

    async testMethods() {
        const mnemonic = process.env.MNEMONIC;
        const providerOrUrl =
            "https://rinkeby.infura.io/v3/87902c981be0460c94930d13b31b7eb0";
        const provider = new HDWalletProvider({ mnemonic, providerOrUrl });
        const web3 = new Web3(provider);

        const NameContract = new web3.eth.Contract(
            [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_effectiveOwner",
                            type: "address",
                        },
                        {
                            internalType: "string",
                            name: "_assetAddress",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "_assetUsableArea",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_assetId",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "nonpayable",
                    type: "constructor",
                    signature: "constructor",
                },
                {
                    anonymous: false,
                    inputs: [
                        {
                            components: [
                                {
                                    internalType: "address",
                                    name: "bankId",
                                    type: "address",
                                },
                                {
                                    internalType: "uint256",
                                    name: "collateralShares",
                                    type: "uint256",
                                },
                                {
                                    internalType: "uint256",
                                    name: "expirationDate",
                                    type: "uint256",
                                },
                            ],
                            indexed: false,
                            internalType: "struct AssetToken.Collateral[]",
                            name: "_collaterals",
                            type: "tuple[]",
                        },
                    ],
                    name: "ShowCollaterals",
                    type: "event",
                    signature:
                        "0x762a1d482e515bf8231fe511fb9cbce8bb5f635bf316faa2a821144949215bfc",
                },
                {
                    anonymous: false,
                    inputs: [
                        {
                            indexed: false,
                            internalType: "address",
                            name: "_effectiveOwner",
                            type: "address",
                        },
                    ],
                    name: "showEffectiveOwner",
                    type: "event",
                    signature:
                        "0xe8e2a5cf2e07719a52678951c69f6f4359fa2c2d7701db47f0958abfc5042f72",
                },
                {
                    anonymous: false,
                    inputs: [
                        {
                            indexed: false,
                            internalType: "address[]",
                            name: "_owners",
                            type: "address[]",
                        },
                    ],
                    name: "showOwners",
                    type: "event",
                    signature:
                        "0x2d7f4338fc6111fa9b766bcf63f335fb7a9bb0fb6e2dfbdb21f346e13cf32495",
                },
                {
                    anonymous: false,
                    inputs: [
                        {
                            components: [
                                {
                                    internalType: "uint256",
                                    name: "shares",
                                    type: "uint256",
                                },
                                {
                                    components: [
                                        {
                                            internalType: "address",
                                            name: "bankId",
                                            type: "address",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "collateralShares",
                                            type: "uint256",
                                        },
                                        {
                                            internalType: "uint256",
                                            name: "expirationDate",
                                            type: "uint256",
                                        },
                                    ],
                                    internalType:
                                        "struct AssetToken.Collateral[]",
                                    name: "collaterals",
                                    type: "tuple[]",
                                },
                            ],
                            indexed: false,
                            internalType: "struct AssetToken.Owner[]",
                            name: "_percentageOwners",
                            type: "tuple[]",
                        },
                    ],
                    name: "showPercentageOwners",
                    type: "event",
                    signature:
                        "0x03435a80186b29dcbad13fe542c5ab4b7e23cf2fb78c6b18bceca1b75c113118",
                },
                {
                    inputs: [],
                    name: "assetAddress",
                    outputs: [
                        { internalType: "string", name: "", type: "string" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x1ba46cfd",
                },
                {
                    inputs: [],
                    name: "assetId",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x44de240a",
                },
                {
                    inputs: [],
                    name: "assetUsableArea",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x0850a462",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_bankId",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "_collateralShares",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_expirationDate",
                            type: "uint256",
                        },
                    ],
                    name: "createCollateral",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                    signature: "0xdcba635c",
                },
                {
                    inputs: [],
                    name: "creator",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x02d05d3f",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_ownerAddress",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "_collateralShares",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_expirationDate",
                            type: "uint256",
                        },
                    ],
                    name: "deleteCollateral",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                    signature: "0x787dcdcb",
                },
                {
                    inputs: [],
                    name: "effectiveOwner",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0xac041617",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_owner",
                            type: "address",
                        },
                    ],
                    name: "getCollateralNumber",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0xe5653f6f",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_owner",
                            type: "address",
                        },
                    ],
                    name: "getCollateralShares",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x9b1f37e3",
                },
                {
                    inputs: [],
                    name: "getOwnersNumber",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x8638fb5a",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_address",
                            type: "address",
                        },
                    ],
                    name: "isAddressOwner",
                    outputs: [
                        { internalType: "bool", name: "", type: "bool" },
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x3511de41",
                },
                {
                    inputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    name: "owners",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x025e7c27",
                },
                {
                    inputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                    name: "percentageOwners",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "shares",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0xc88bfce4",
                },
                {
                    inputs: [],
                    name: "totalSupply",
                    outputs: [
                        { internalType: "uint256", name: "", type: "uint256" },
                    ],
                    stateMutability: "view",
                    type: "function",
                    constant: true,
                    signature: "0x18160ddd",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_transferShares",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "_buyer",
                            type: "address",
                        },
                        {
                            internalType: "bool",
                            name: "_isEffectiveOwnerTransfer",
                            type: "bool",
                        },
                    ],
                    name: "transferOwnership",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                    signature: "0x1b73e46d",
                },
            ] as any, // "as any" because typescript does not recognize "signature"
            "0xa386ac7A1c5DABCB84Fa21c62c7369aE95b57D45",
        );
        return JSON.stringify(
            await NameContract.methods
                .isAddressOwner("0xFAaA90Abfde4668eCE05ae694674e01DC8C7072c")
                .call(),
        );
    }
}
