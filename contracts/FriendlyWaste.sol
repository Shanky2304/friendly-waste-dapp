//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FriendlyWaste{

    // Structure to store company stats
    struct Stats {
        uint foodWaste;
        string name;
        //string desc;
        bool verified; // only admin can mark a company verified
    }

    /*
    * A struct to record facts about the company 
    * which can be used to segregate them in future like industry
    */
    struct Company {
        string name;
        string industry;
    }

    // Set in the contructor
    address admin;

    // List of addresses of all the registered companies
    address[] registeredCompanies;

    // Mappings to store above structures using the company address as key
    mapping (address => Company) addrToCompany;
    mapping (address => Stats) addrToStats;

    /* 
    * Called during deploy to set the admin address
    */
    constructor () {
        admin = msg.sender;
    }

    modifier onlyAdmin() 
    {
        require(msg.sender == admin, "Only the admin can make this request!");
        _;
    }

    modifier isVerified(){
        require(addrToStats[msg.sender].verified == true, "Not a verified company.");
        _;
    }

    /*
    * Method used to register a company
    */
    function register(string memory name, string memory industry) public {
        // Required none of the values are null

        registeredCompanies.push(msg.sender);
        Company storage company = addrToCompany[msg.sender];
        company.name = name;
        company.industry = industry;

    }

    /*
    * Method used to mark a company verified. Can only be called by the admin.
    */
    function verify(address companyAddress) public onlyAdmin{
        addrToStats[companyAddress].verified = true;
        //console.log("");
    }

    /*
    * Method used to read company stats from the chain. Incurs no cost is marked a 'view'.
    */
    function getCompanyStats(address companyAddress) public isVerified view returns(Stats memory) {
        // Maybe check if they're verified too
        return addrToStats[companyAddress];
    }

    /*
    * Method used to read company addresses from the chain. Incurs no cost is marked a 'view'.
    */
    function getRegisteredCompanies() public view returns(address[] memory) {
        return registeredCompanies;
    }

    /*
    * Method used by verifed companies to report their stats.
    */
    function updateCompanyStats(uint foodWaste) public isVerified {
        addrToStats[msg.sender].foodWaste = foodWaste;
        //addrToStats[msg.sender].desc = addrToCompany[msg.sender].name;
        addrToStats[msg.sender].name = addrToCompany[msg.sender].name;

    }
}