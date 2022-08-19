/* SPDX-License-Identifier: UNLICENSED */
pragma solidity ^0.8.7;

contract AssetToken {

    // Define collateral structure

    struct Collateral {
        address bankId;
        uint collateralShares;
        uint expirationDate;
    }

    // Define owner structure

    struct Owner {
        uint shares;
        Collateral[] collaterals;
    }

    // Define state variables for the contract

    address public creator = msg.sender;                     // contract creator: must be platform. For auditability purposes
    address public effectiveOwner;                           // address of the property's current owner  
    address[] public owners;                                 // array with addresses of owners
    mapping (address => Owner) public percentageOwners;     // mapping all owners               
                
    uint public totalSupply;                    // total supply of tokens. Default set to 1000, so 1% of the asset equal 10 tokens
    string public assetAddress;                 // address of the asset being tokenized
    uint public assetUsableArea;                // usable area of the tokenized asset
    uint public assetId;                        // asset identification number (In Brazil, Cadastro Imobiliário Brasileiro (CIB) (???) )

    // Define modifiers for function usage

    modifier onlyPlatform {
        require(msg.sender == creator);
	    _;
    }

    modifier onlyEffectiveOwner {
	    require(msg.sender == effectiveOwner);
	    _;
	}

    modifier onlyOwner {
        (bool isOwner, ) = isAddressOwner(msg.sender);
	    require(isOwner);
	    _;
	}

    modifier onlyPlatformOrEffectiveOwner {
        require(msg.sender == creator || msg.sender == effectiveOwner);
	    _;
    }

    modifier onlyPlatformOrOwner {
        (bool isOwner, ) = isAddressOwner(msg.sender);
        require(msg.sender == creator || isOwner);
	    _;
    }

    // Define constructor to create tokenization

    constructor(address _effectiveOwner, string memory _assetAddress, uint _assetUsableArea, uint _assetId) {
        creator = msg.sender;
        assetAddress = _assetAddress;
        assetUsableArea = _assetUsableArea;
        assetId = _assetId;
        effectiveOwner = _effectiveOwner;
        totalSupply = 1000;
        percentageOwners[_effectiveOwner].shares = totalSupply;

        owners.push(effectiveOwner);
    }

    function isAddressOwner(address _address) public view returns(bool, uint256) {
        for (uint256 i = 0; i < owners.length; i += 1) {
	        if (_address == owners[i]) return (true, i);
	    }
	    return (false, 0); 
    }

    // Function to get number of owners of the asset

    function getOwnersNumber() public view returns(uint) {
        return owners.length;
    }

    // Function to get number of collaterals associated with owner

    function getCollateralNumber(address _owner) public view onlyPlatformOrOwner returns(uint) {
        return percentageOwners[_owner].collaterals.length;
    }

    // Function to get total number of shares that are being used as collateral

    function getCollateralShares(address _owner) public view onlyPlatformOrOwner returns(uint) {
        Collateral[] storage collaterals =  percentageOwners[_owner].collaterals;
        uint256 sum = 0;

        for(uint256 i = 0; i < collaterals.length; i++) {
            sum = sum + collaterals[i].collateralShares;
        }
        return sum;
    }
    
    // Function to remove owner from owners array

    function removeOwner(address _owner) private
    {
        (bool isOwner, uint256 index) = isAddressOwner(_owner);

        if (!isOwner || _owner == effectiveOwner) return; // dont delete when address isnt on array or when owner is effective owner

        owners[index] = owners[owners.length - 1];
        owners.pop();
    }

    // Function to split ownership between owners

    function transferOwnership(uint _transferPercentage, address _buyer, bool _isEffectiveOwnerTransfer) public onlyPlatformOrOwner 
    {

        Owner storage payer = percentageOwners[msg.sender];
        require((payer.shares - getCollateralShares(msg.sender)) >= _transferPercentage);

        if (_isEffectiveOwnerTransfer) {
            require(msg.sender == effectiveOwner);
            effectiveOwner = _buyer;
        }

        payer.shares -= _transferPercentage;
        percentageOwners[_buyer].shares += _transferPercentage;

        (bool isBuyerOwner,) =  isAddressOwner(_buyer);

        if (!isBuyerOwner) owners.push(_buyer);

        if (payer.shares == 0) removeOwner(msg.sender);
    }
}