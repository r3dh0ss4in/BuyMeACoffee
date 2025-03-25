// SPDX-License-Identifier: MIT

// Contract elements should be laid out in the following order:

//     Pragma statements

//     Import statements

//     Events

//     Errors

//     Interfaces

//     Libraries

//     Contracts

// Inside each contract, library or interface, use the following order:

//     Type declarations

//     State variables

//     Events

//     Errors

//     Modifiers

//     Functions


pragma solidity 0.8.24;

/**
 * @title BuyMeACoffee
 * @author Reduan Hossain
 */

contract BuyMeACoffee {
    // Types

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // State variables

    address payable owner;
    Memo[] memos;
    
    // Events 

    event NewMemo(address indexed from, uint256 timestamp, string name, string message);

    // Functions

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee for free!");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

    function withdraw() public {
        // I will use call over send
        require(owner.send(address(this).balance));
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}