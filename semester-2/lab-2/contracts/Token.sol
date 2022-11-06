// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lab2Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("Lab2Token", "L2T") {
        _mint(msg.sender, initialSupply);
    }
}

