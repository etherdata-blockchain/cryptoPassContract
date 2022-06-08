import { ethers, run } from "hardhat";

async function main() {
  await run("compile");

  // We get the contract to deploy
  const contract = await ethers.getContractFactory("CryptoPass");
  const file = await contract.deploy();

  await file.deployed();

  console.log("CryptoPass deployed to:", file.address);
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
