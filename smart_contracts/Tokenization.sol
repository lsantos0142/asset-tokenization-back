/* SPDX-License-Identifier: UNLICENSED */
pragma solidity ^0.8.7;

contract Tokenization {

    // Define collateral structure

    struct Collateral {
        address bankId;
        uint collateralQuantity;
        uint expirationDate;
    }

    // Define owner structure

    struct Owner {
        address ownerId;
        uint ownerQuantity;
        Collateral[] collaterals;
    }

    // Define state variables for the contract

    address public creator;                     // contract creator: must be platform. For auditability purposes
    address public effectiveOwner;              // address of the property's current owner
    uint public totalSupply;                    // total supply of tokens. Default set to 1000, so 1% of the asset equal 10 tokens
    Owner[] public percentageOwners;            // information about percentage owners of the asset, including eventual collaterals associated with them
    string public assetAddress;                 // address of the asset being tokenized
    uint public assetUsableArea;                // usable area of the tokenized asset
    uint public assetId;                        // asset identification number (In Brazil, Cadastro Imobiliário Brasileiro (CIB) (???) )

    // Define modifiers for function usage

    modifier onlyPlatform {
        require(msg.sender == creator);
	    _;
    }

    modifier onlyOwner {
	    require(msg.sender == effectiveOwner);
	    _;
	}

    modifier onlyPlatformOrOwner {
        require(msg.sender == creator || msg.sender == effectiveOwner);
	    _;
    }

    // Define constructor to create tokenization

    constructor(address _ownerId, string memory _assetAddress, uint _assetUsableArea, uint _assetId) {
        creator = msg.sender;
        assetAddress = _assetAddress;
        assetUsableArea = _assetUsableArea;
        assetId = _assetId;
        effectiveOwner = _ownerId;
        totalSupply = 1000;
        Owner storage o = percentageOwners.push();
        o.ownerId = _ownerId;
        o.ownerQuantity = 1000;
    }

    // Function to get number of owners of the asset

    function getOwnerNumber() public view onlyPlatformOrOwner returns(uint count) {
        return percentageOwners.length;
    }

    // Function to get number of collaterals associated with owner

    function getCollateralNumber(uint _ownerId) public view onlyPlatformOrOwner returns(uint count) {
        return percentageOwners[_ownerId].collaterals.length;
    }
}