export const contractAbi = [
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
                        internalType: "struct AssetToken.Collateral[]",
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
            {
                internalType: "string",
                name: "",
                type: "string",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
                internalType: "address",
                name: "_seller",
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
        signature: "0xcac58d9f",
    },
    {
        inputs: [],
        name: "creator",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
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
                internalType: "address",
                name: "_bankAddress",
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
        signature: "0xae46d3ca",
    },
    {
        inputs: [],
        name: "effectiveOwner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
        signature: "0x3511de41",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "owners",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
        signature: "0x025e7c27",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
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
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
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
                name: "_seller",
                type: "address",
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
        signature: "0xfd1c2dd8",
    },
];
