// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery{

    address public manager;
    address[] public players;


    constructor() {
        //msg is a global inbuilt variable
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted{
        uint index = random() % players.length;
        //send all the money from the current contract to this address
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    //acts like a middleware, carries other code and put it in the '_' position
    modifier restricted(){
        require (msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }
   
}