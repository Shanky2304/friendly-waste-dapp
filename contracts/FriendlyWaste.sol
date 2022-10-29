//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FriendlyWaste{

    struct Stats {
        uint foodWaste;
        uint rank;
        string desc;
        bool verified; // only admin can mark a company verified
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

    function register(string memory name, string memory industry) public {
        Company storage company = addrToCompany[msg.sender];
        company.name = name;
        company.industry = industry;

    }

    function verify(address companyAddress) public onlyAdmin{
        addrToStats[companyAddress].verified = true;
    }

    function getCompanyStats(address companyAddress) public view returns(Stats memory stats) {
        // Maybe check if they're verified too
        return addrToStats[companyAddress];

    }

    function updateCompanyStats(uint foodWaste, string memory desc) public isVerified{
        addrToStats[msg.sender].foodWaste = foodWaste;  
        addrToStats[msg.sender].desc = desc;

    }
}