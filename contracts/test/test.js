const { expect } = chai;
const { ethers } = require("hardhat");

describe("HealthcareRecordsWithList", function () {
  let healthcareRecords;
  let owner;
  let addr1;

  beforeEach(async function () {
    const HealthcareRecordsWithList = await ethers.getContractFactory("HealthcareRecordsWithList");
    [owner, addr1] = await ethers.getSigners();

    healthcareRecords = await HealthcareRecordsWithList.deploy();
    await healthcareRecords.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await healthcareRecords.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should add a record", async function () {
      // Example IPFS hash
      const ipfsHash = "QmTqu3LStYcKgQK4hRZD9Q9HcC2YCbqJmNMqAJq2RqNz8X";
      await healthcareRecords.connect(addr1).addRecord(ipfsHash);

      const records = await healthcareRecords.getRecords(addr1.address);
      expect(records).to.include(ipfsHash);
    });

    it("Should return the correct number of records", async function () {
      const ipfsHash1 = "QmTqu3LStYcKgQK4hRZD9Q9HcC2YCbqJmNMqAJq2RqNz8X";
      const ipfsHash2 = "QmTqu3LStYcKgQK4hRZD9Q9HcC2YCbqJmNMqAJq2RqNz8Y";
      await healthcareRecords.connect(addr1).addRecord(ipfsHash1);
      await healthcareRecords.connect(addr1).addRecord(ipfsHash2);

      const recordCount = await healthcareRecords.getRecordsCount(addr1.address);
      expect(recordCount).to.equal(2);
    });
  });
});
