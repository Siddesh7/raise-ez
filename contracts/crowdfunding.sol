// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        uint id;
        address payable beneficiary;
        address creator; // Added creator address
        string name;
        string description;
        uint goal;
        uint fundsRaised;
        uint campaignBalance;
    }

    address public owner;
    Campaign[] public campaigns;
    mapping(address => uint[]) private campaignsByCreator; // Tracks campaign IDs by creator
    mapping(address => uint) public depositorBalances;

    event FundsDeposited(address indexed depositor, uint amount);
    event CampaignCreated(uint indexed campaignId, string name, string description, uint goal, address beneficiary, address creator);
    event DonationMade(uint indexed campaignId, address donor, uint amount);
    event FundsWithdrawn(uint indexed campaignId, address beneficiary, uint amount);

    modifier onlyOwner() {
            require(msg.sender == owner, "Caller is not the owner");
            _;
        }

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // Function for users to deposit funds into the contract
    function depositFunds() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        depositorBalances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    // Function to create a campaign

    function createCampaign(string memory name, string memory description, uint goal, address payable beneficiary) public {
        uint campaignId = campaigns.length;
        Campaign memory newCampaign = Campaign({
            id: campaignId,
            beneficiary: beneficiary,
            creator: msg.sender, 
            name: name,
            description: description,
            goal: goal,
            fundsRaised: 0,
            campaignBalance: 0
        });
        campaigns.push(newCampaign);
        campaignsByCreator[msg.sender].push(campaignId); // Track the campaign by its creator
        emit CampaignCreated(campaignId, name, description, goal, beneficiary, msg.sender);
    }


    // Function to donate to a specific campaign using deposited funds
    function donateToCampaign(address from,uint campaignId, uint amount) public onlyOwner {
        require(campaignId < campaigns.length, "Invalid campaign ID");
        require(depositorBalances[from] >= amount, "Insufficient balance to donate");
        require(amount > 0, "Donation amount must be greater than 0");

        Campaign storage campaign = campaigns[campaignId];
        depositorBalances[from] -= amount; // Deduct the donation amount from the depositor's balance
        campaign.fundsRaised += amount;
        campaign.campaignBalance += amount;
        emit DonationMade(campaignId, from, amount);
    }

    // Function for a campaign creator to withdraw funds
    function withdrawFunds(uint campaignId) public {
        require(campaignId < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.beneficiary, "Only the campaign creator can withdraw funds");
        uint amountToWithdraw = campaign.campaignBalance;

        require(amountToWithdraw > 0, "No funds to withdraw");
        campaign.beneficiary.transfer(amountToWithdraw);
        campaign.campaignBalance = 0; // Reset the campaign balance after withdrawal
        emit FundsWithdrawn(campaignId, campaign.beneficiary, amountToWithdraw);
    }

    // Function to return all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    // Function to return details for a given campaign ID
    function getCampaign(uint campaignId) public view returns (Campaign memory) {
        require(campaignId < campaigns.length, "Invalid campaign ID");
        return campaigns[campaignId];
    }
    // Function to check the deposited balance of a given address
    function getDepositorBalance(address depositor) public view returns (uint) {
        return depositorBalances[depositor];
    }
    // Function for users to withdraw their deposited funds from the contract
    function withdrawDepositedFunds() public {
        uint amount = depositorBalances[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Set the depositor's balance to 0 before transferring to prevent re-entrancy attacks
        depositorBalances[msg.sender] = 0;
        
        // Transfer the amount back to the depositor
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    function getCampaignsByCreator(address creator) public view returns (Campaign[] memory) {
        uint[] memory campaignIds = campaignsByCreator[creator];
        Campaign[] memory creatorCampaigns = new Campaign[](campaignIds.length);

        for (uint i = 0; i < campaignIds.length; i++) {
            creatorCampaigns[i] = campaigns[campaignIds[i]];
        }

        return creatorCampaigns;
    }


}
