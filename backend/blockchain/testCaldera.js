require("dotenv").config();
const { ethers } = require("ethers");

// Assuming the ABI has been updated to reflect the new structure of the smart contract
const contractABI = require("../../contracts/artifacts/contracts/EHRAdd.sol/EHRAdd.json").abi;
const contractAddress = "0x9d1b87B78AF57Bd856a409C1Eb0A949e5917bC17";

const providerUrl = "https://treehacks-devnet.rpc.caldera.xyz/http";
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

const healthcareRecordsContract = new ethers.Contract(contractAddress, contractABI, signer);

// Modified to accept key, cid, and filePath
async function addRecord(key, cid, filePath) {
    try {
        // Updated to pass the new parameters
        const tx = await healthcareRecordsContract.addRecord(key, cid, filePath);
        const receipt = await tx.wait();

        console.log(`Transaction Hash: ${receipt.transactionHash}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`Block Number: ${receipt.blockNumber}`);
        console.log(`Record added with Key: ${key}, CID: ${cid}, and File Path: ${filePath}`);

        for (const event of receipt.events) {
            if (event.event === 'RecordAdded') {
                console.log(`Event RecordAdded: Key - ${event.args.key}, CID - ${event.args.cid}, File Path - ${event.args.filePath}`);
            }
        }
    } catch (error) {
        console.error(`Failed to add record: ${error}`);
    }
}

async function getRecords(userAddress) {
    try {
        const records = await healthcareRecordsContract.getRecords(userAddress);
        console.log(`Records for ${userAddress}:`, records.map(record => ({
            key: record.key,
            cid: record.cid,
            filePath: record.filePath
        })));
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
// Example values for the new parameters
const keyToAdd = "exampleKey";
const cidToAdd = "exampleCID";
const filePathToAdd = "/example/path";

(async () => {
    await addRecord(keyToAdd, cidToAdd, filePathToAdd); // Updated function call
    await getRecords(userAddress);
    await getRecordsCount(userAddress);
})();
