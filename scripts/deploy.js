const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  await upload.waitForDeployment();
  const address = await upload.getAddress();

  console.log("Upload deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });