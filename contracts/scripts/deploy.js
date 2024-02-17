const { ethers } = require("hardhat");

async function main() {
  const EHRAdds = await ethers.getContractFactory("EHRAdd");
  const eHRAdds = await EHRAdds.deploy();

  await eHRAdds.deployed();

  console.log("HealthcareRecordsWithList deployed to:", eHRAdds.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
