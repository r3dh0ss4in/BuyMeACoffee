// scripts/withdraw.js

const hre = require("hardhat");

async function main() {
    // 1. Get the contract factory
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    
    // 2. Connect to the deployed contract
    const contractAddress = "0xF0275686cC03fEf225f16f4c33C9fE4d64E66362";
    const buyMeACoffee = await BuyMeACoffee.attach(contractAddress);
    
    // 3. Get the owner/signer
    const [owner] = await hre.ethers.getSigners();
    
    console.log("Using account:", owner.address);
    
    // 4. Get balances
    const ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    const contractBalance = await hre.ethers.provider.getBalance(contractAddress);
    
    console.log("Owner balance:", hre.ethers.formatEther(ownerBalance), "ETH");
    console.log("Contract balance:", hre.ethers.formatEther(contractBalance), "ETH");

    // 5. Withdraw if balance > 0
    if (contractBalance > 0) {
        console.log("Withdrawing funds...");
        const withdrawTxn = await buyMeACoffee.connect(owner).withdraw();
        await withdrawTxn.wait();
        console.log("Withdrawal successful!");
        
        // Check new balances
        const newOwnerBalance = await hre.ethers.provider.getBalance(owner.address);
        console.log("New owner balance:", hre.ethers.formatEther(newOwnerBalance), "ETH");
    } else {
        console.log("No funds to withdraw!");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });