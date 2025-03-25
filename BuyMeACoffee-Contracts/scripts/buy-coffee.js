// scripts/buy-coffee.js

const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt); // Updated this line
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // Wait for deployment to complete
  await buyMeACoffee.waitForDeployment();
  
  // Get the contract address
  const contractAddress = await buyMeACoffee.getAddress();
  console.log("BuyMeACoffee deployed to:", contractAddress);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, contractAddress];
  console.log("== START ==");
  await printBalances(addresses);

  // Buy the owner a  few coffees.
  const tip = {value: hre.ethers.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Hasan", "Hello Farena", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Jakaria", "How are you", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Dalia", "What are you doing?", tip);

  // Check balance after the coffee purchase.
  console.log("== BOUGHT COFFEE ==");
  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(owner).withdraw();

  // Check balance after withdraw.
  console.log("== WITHDRAW ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== MEMOS ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });