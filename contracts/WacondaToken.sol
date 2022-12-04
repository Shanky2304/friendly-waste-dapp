// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WacondaToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Waconda", "WACO") {
        _mint(msg.sender, initialSupply);
    }
}