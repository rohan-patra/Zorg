// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRAdd {
    struct Record {
        string key;
        string cid;
        string filePath;
    }

    mapping(address => Record[]) private userRecords;

    event RecordAdded(
        address indexed user,
        string key,
        string cid,
        string filePath
    );
    event RecordUpdated(
        address indexed user,
        uint recordIndex,
        string key,
        string cid,
        string filePath
    );
    event RecordDeleted(address indexed user, uint recordIndex);

    function addRecord(
        string memory key,
        string memory cid,
        string memory filePath
    ) public {
        userRecords[msg.sender].push(Record(key, cid, filePath));
        emit RecordAdded(msg.sender, key, cid, filePath);
    }

    function updateRecord(
        uint index,
        string memory key,
        string memory cid,
        string memory filePath
    ) public {
        require(
            index < userRecords[msg.sender].length,
            "Record does not exist."
        );
        userRecords[msg.sender][index] = Record(key, cid, filePath);
        emit RecordUpdated(msg.sender, index, key, cid, filePath);
    }

    function deleteRecord(uint index) public {
        require(
            index < userRecords[msg.sender].length,
            "Record does not exist."
        );
        for (uint i = index; i < userRecords[msg.sender].length - 1; i++) {
            userRecords[msg.sender][i] = userRecords[msg.sender][i + 1];
        }
        userRecords[msg.sender].pop();
        emit RecordDeleted(msg.sender, index);
    }

    function getRecords(address user) public view returns (Record[] memory) {
        return userRecords[user];
    }

    function getRecordsCount(address user) public view returns (uint) {
        return userRecords[user].length;
    }

    function getRecordAtIndex(
        address user,
        uint index
    ) public view returns (Record memory) {
        require(index < userRecords[user].length, "Record does not exist.");
        return userRecords[user][index];
    }
}
