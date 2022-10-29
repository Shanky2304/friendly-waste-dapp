//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FriendlyWaste{

    struct Stats {
        uint foodWaste;
        uint rank;
        string desc;
        bool verified = false; // only admin can mark a company verified
    }

    struct Company {
        string name;
        string industry;
    }

    address admin;

    mapping (address => Company) addrToCompany;
    mapping (address => Stats) addrToStats;

    constructor () {
        admin = msg.sender;
    }

    modifier onlyAdmin() 
    {
        require(msg.sender == admin);
        _;
    }

    modifier isVerified(){
        require(addrToStats[msg.sender].verified == true, "Not a verified company.");
        _;
    }

    function register(string name, string industry) public {

        address companyAddress = msg.sender;
        addrToCompany[companyAddress].name = name
        addrToCompany[companyAddress].industry = industry

    }

    function verify(address companyAddress) public onlyAdmin{
        addrToCompany[companyAddress].verified = true
    }

    function getCompanyStats(address companyAddress) public view returns(Stats stats) {
        // Maybe check if they're verified too
        stats = addrToStats[companyAddress]

    }

    function updateCompanyStats(uint foodWaste, string desc) isVerified{
        addrToStats[msg.sender].foodWaste = foodWaste  
        addrToStats[msg.sender].desc = desc  

    }
}