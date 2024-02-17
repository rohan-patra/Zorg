require("dotenv").config();
const { ethers } = require("ethers");

const contractABI = require("../../contracts/artifacts/contracts/EHRAdd.sol/EHRAdd.json").abi;
const contractAddress = "0x10FdE1ba4cb12518e0419C0c9fcEb8A4155f61d3"; 

const providerUrl = "https://treehacks-devnet.rpc.caldera.xyz/http"; 
const privateKey = process.env.PRIVATE_KEY; 

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

const healthcareRecordsContract = new ethers.Contract(contractAddress, contractABI, signer);

async function addRecord(ipfsHash) {
    try {
        const tx = await healthcareRecordsContract.addRecord(ipfsHash);
        await tx.wait();
        console.log(`Record added with hash: ${ipfsHash}`);
    } catch (error) {
        console.error(`Failed to add record: ${error}`);
    }
}

async function getRecords(userAddress) {
    try {
        const records = await healthcareRecordsContract.getRecords(userAddress);
        console.log(`Records for ${userAddress}:`, records);
    } catch (error) {
        console.error(`Failed to get records: ${error}`);
    }
}

async function getRecordsCount(userAddress) {
    try {
        const count = await healthcareRecordsContract.getRecordsCount(userAddress);
        console.log(`Number of records for ${userAddress}: ${count}`);
    } catch (error) {
        console.error(`Failed to get records count: ${error}`);
    }
}

const userAddress = "0xaf75E5Ea5D6CcA3059F4261201D51fFFe7b0DB6e";
const ipfsHashToAdd = "QmTqu3LStYcKgQK4hRZD9Q9HcC2YCbqJmNMqAJq2RqNz8X"; 

(async () => {
    await addRecord(ipfsHashToAdd);
    await getRecords(userAddress);
    await getRecordsCount(userAddress);
})();
