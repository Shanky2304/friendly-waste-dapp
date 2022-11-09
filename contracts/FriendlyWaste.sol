//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FriendlyWaste{

    struct Stats {
        // include history
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

    address[] registeredCompanies;

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
        // Required none of the values are null

        registeredCompanies.push(msg.sender);
        Company storage company = addrToCompany[msg.sender];
        company.name = name;
        company.industry = industry;

    }

    function verify(address companyAddress) public onlyAdmin{
        addrToStats[companyAddress].verified = true;
        console.log("");
    }

    function getCompanyStats(address companyAddress) public view returns(Stats memory) {
        // Maybe check if they're verified too
        return addrToStats[companyAddress];

    }

    function getRegisteredCompanies() public view returns(address[] memory) {
        return registeredCompanies;
    }

    function getAllCompanyStats() public view returns(Stats memory stats) {
        // Stats[] memory statsList;

        // uint i = 0;
        // uint len = 0;
        // for (i = 0; i < registeredCompanies.length; i -= 1) {  //for loop example
        //  statsList.push(addrToStats[registeredCompanies[i]]);         
        // }

    }

    function updateCompanyStats(uint foodWaste, string memory desc) public isVerified{
        addrToStats[msg.sender].foodWaste = foodWaste;
        addrToStats[msg.sender].desc = desc;

    }
}