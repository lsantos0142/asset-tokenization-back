/* SPDX-License-Identifier: UNLICENSED */
pragma solidity ^0.8.7;

contract AssetToken {

    // Define collateral structure

    struct Collateral {
        address bankId;
        uint collateralShares;
        uint expirationDate;
    }

    struct RentPayment {
        uint amount;
        uint shares;
        uint paymentDate;
    }

    // Define owner structure

    struct Owner {
        uint shares;
        address walletId;
        Collateral[] collaterals;
        RentPayment[] rentPayments;
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

    // Define events

    event showOwners(address[] _owners);
    event showEffectiveOwner(address _effectiveOwner);
    event showPercentageOwners(Owner[] _percentageOwners);
    event showCollaterals(Collateral[] _collaterals);

    // Define modifiers for function usage

    modifier onlyPlatform {
        require(msg.sender == creator);
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
        percentageOwners[_effectiveOwner].walletId = _effectiveOwner;

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

    // Function to get owners of the asset

    function getOwnersAdresses() public view returns(address[] memory) {
        return owners;
    }

    function getOwnerDetails(address _owner) public view returns(Owner memory) {
        return percentageOwners[_owner];
    }

    function getAllOwnersDetails() public view returns (Owner[] memory){
        Owner[] memory ownersResponse = new Owner[](owners.length);
        for (uint i = 0; i < owners.length; i++) {
            ownersResponse[i] = percentageOwners[owners[i]];
        }
        return ownersResponse;
    }

    function getRentPaymentsByOwner(address _owner) public view onlyPlatformOrOwner returns(RentPayment[] memory) {
        return percentageOwners[_owner].rentPayments;
    }

    function getCollateralsByOwner(address _owner) public view onlyPlatformOrOwner returns(Collateral[] memory) {
        return percentageOwners[_owner].collaterals;
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

    function removeOwner(address _owner) private {

        (bool isOwner, uint256 index) = isAddressOwner(_owner);

        if (!isOwner || _owner == effectiveOwner) return; // dont delete when address isnt on array or when owner is effective owner

        owners[index] = owners[owners.length - 1];
        owners.pop();

        emit showOwners(owners);
    }

    // Function to split ownership between owners

    function transferOwnership(uint _transferShares, address _seller, address _buyer, bool _isEffectiveOwnerTransfer) public onlyPlatformOrOwner {

        Owner storage seller = percentageOwners[_seller];
        require((seller.shares - getCollateralShares(_seller)) >= _transferShares);

        if (_isEffectiveOwnerTransfer) {
            require(_seller == effectiveOwner);
            effectiveOwner = _buyer;
            emit showEffectiveOwner(effectiveOwner);
        }

        seller.shares -= _transferShares;
        percentageOwners[_buyer].shares += _transferShares;

        (bool isBuyerOwner,) =  isAddressOwner(_buyer);

        if (!isBuyerOwner) {
            owners.push(_buyer);
            percentageOwners[_buyer].walletId = _buyer;
        }

        if (seller.shares == 0) removeOwner(_seller);
    }

    // Function to create collateral from sender token balance to bank address
    
    function createCollateral(address _bankId, address _seller, uint _collateralShares, uint _expirationDate) public onlyPlatformOrOwner {

        Owner storage owner = percentageOwners[_seller];
        require((owner.shares - getCollateralShares(_seller)) >= _collateralShares);

        owner.collaterals.push(Collateral({
            bankId: _bankId,
            collateralShares: _collateralShares,
            expirationDate: _expirationDate
        }));

        emit showCollaterals(owner.collaterals);
    }

    // Function to delete collateral associated with bank address of msg.sender from owner

    function deleteCollateral(address _ownerAddress, address _bankAddress, uint _collateralShares, uint _expirationDate) public {

        Collateral[] storage collaterals =  percentageOwners[_ownerAddress].collaterals;

        for(uint256 i = 0; i < collaterals.length; i++) {
            if(collaterals[i].bankId == _bankAddress && 
               collaterals[i].collateralShares == _collateralShares && 
               collaterals[i].expirationDate == _expirationDate)
            {
                collaterals[i] = collaterals[collaterals.length -1];
                collaterals.pop();
                break;
            }
        }
    }

    // Function to register all rent payment stakes

    function registerRentPayment(uint _amount, uint _paymentDate) public onlyPlatformOrOwner {
        for(uint256 i = 0; i < owners.length; i++) {
            Owner storage owner =  percentageOwners[owners[i]]; 
            owner.rentPayments.push(RentPayment({
                amount: _amount * owner.shares,
                shares: owner.shares,
                paymentDate: _paymentDate
            }));
        }
    }


}