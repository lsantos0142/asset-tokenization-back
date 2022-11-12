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
        name: "showCollaterals",
        type: "event",
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
                        internalType: "address",
                        name: "walletId",
                        type: "address",
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
                    {
                        components: [
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "shares",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "paymentDate",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct AssetToken.RentPayment[]",
                        name: "rentPayments",
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
    },
    {
        inputs: [],
        name: "getAllOwnersDetails",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "shares",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "walletId",
                        type: "address",
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
                    {
                        components: [
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "shares",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "paymentDate",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct AssetToken.RentPayment[]",
                        name: "rentPayments",
                        type: "tuple[]",
                    },
                ],
                internalType: "struct AssetToken.Owner[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
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
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
        ],
        name: "getCollateralsByOwner",
        outputs: [
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
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
        ],
        name: "getOwnerDetails",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "shares",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "walletId",
                        type: "address",
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
                    {
                        components: [
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "shares",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "paymentDate",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct AssetToken.RentPayment[]",
                        name: "rentPayments",
                        type: "tuple[]",
                    },
                ],
                internalType: "struct AssetToken.Owner",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getOwnersAdresses",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
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
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
        ],
        name: "getRentPaymentsByOwner",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "shares",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymentDate",
                        type: "uint256",
                    },
                ],
                internalType: "struct AssetToken.RentPayment[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
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
            {
                internalType: "address",
                name: "walletId",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_paymentDate",
                type: "uint256",
            },
        ],
        name: "registerRentPayment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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
    },
];
