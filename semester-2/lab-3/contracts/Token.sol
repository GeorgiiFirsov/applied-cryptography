// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// Type for hash representation. Ususally recommended to use bytes32,
// but... Actually it fixes the size forever and maybe it is a flaw.
type hash is bytes32;


contract Lab3Token is ERC20 {
    // Some structure, that describes a miner. For some unknown reason
    // I want to store miners container in contract...
    struct MinerInfo {
        address referrer;
        bool isActive;
        int reputation;
        uint32 coinsMined;
    }

    // Mapping between miner's addresses and their information
    // Call registerMiner to add info to this container
    mapping(address => MinerInfo) miners;


    // Event, that is triggered as soon as new miner is added 
    // into miners container
    event MinerAdded(address minerAddress);

    // Event, that is triggered as soon as a miner's info was changed
    event MinerUpdated(address minerAddress);


    // Hashes of custom associated data
    // Call associateData to add hash to this array
    hash[] associatedHashes;


    // Constructor with initiall supply
    constructor(uint256 initialSupply) ERC20("Lab3Token", "L3T") {
        _mint(msg.sender, initialSupply);
    }


    // Internal function for miner registration
    // Just calling more generic registerMiner from another registerMiner
    // doesn't actually compile :(
    function registerMinerInternal(address minerAddress, address referrerAddress) internal {
        //
        // Just create a new miner
        //
 
        miners[minerAddress] = MinerInfo(
            {
                referrer: referrerAddress,
                isActive: true,
                reputation: 0,
                coinsMined: 0
            }
        );
  
        //
        // Now let's notify about miner's creation
        //

        emit MinerAdded(minerAddress);
    }


    // Register a new miner with explicitly specifier referrer
    function registerMiner(address minerAddress, address referrerAddress) external {
        return registerMinerInternal(minerAddress, referrerAddress);
    }


    // Register a new miner
    function registerMiner(address minerAddress) external {
        //
        // Just call internal function and pass 0x00 as a referrerAddress
        //

        return registerMinerInternal(minerAddress, address(0x00));
    }


    // Update miner's information
    function updateMiner(address minerAddress, bool isActive_, int reputation_, uint32 coinsMined_) external {
        //
        // Get reference to the stored object
        //

        MinerInfo storage info = miners[minerAddress];
	
        //
        // Modify data and then emit an event about changing miner's state
        //

        info.isActive = isActive_;
        info.reputation = reputation_;
        info.coinsMined = coinsMined_;

        emit MinerUpdated(minerAddress);
    }


    // Query for miner information
    function getMinerInfo(address minerAddress)
        external
        view
        returns(address, bool, int, uint32)
    {
        //
        // Create reference to the real object and return its fields
        //

        MinerInfo storage info = miners[minerAddress];

        return (
            info.referrer,
            info.isActive,
            info.reputation,
            info.coinsMined
        );
    }


    // Associates data with contract for some reason... I don't know actually what it can be used for, 
    // nevermind this function must be present here. Returns a new hash index.
    function associateData(bytes memory data) 
        external
        returns (uint)
    {
        //
        // Just compute hash and return it's index in array
        //

        associatedHashes.push(hash.wrap(sha256(data)));
        return associatedHashes.length - 1;
    }


    // Queries for a hash by index. If index is valid, then function returns (true, hash at index),
    // otherwise, it returns (false, 0x00)
    function queryHash(uint index)
        external
        view
        returns (bool, hash)
    {
        return index < associatedHashes.length 
            ? (true, associatedHashes[index]) 
            : (false, hash.wrap(0x00));
    }
}

