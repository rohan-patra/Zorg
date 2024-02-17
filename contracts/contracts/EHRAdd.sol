// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRAdd {
    mapping(address => string[]) private userRecords;

    event RecordAdded(address indexed user, string ipfsHash);

    function addRecord(string memory ipfsHash) public {
        userRecords[msg.sender].push(ipfsHash);
        emit RecordAdded(msg.sender, ipfsHash);
    }

    function getRecords(address user) public view returns (string[] memory) {
        return userRecords[user];
    }

    function getRecordsCount(address user) public view returns (uint) {
        return userRecords[user].length;
    }
}
