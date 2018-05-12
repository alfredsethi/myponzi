pragma solidity ^0.4.20;

contract Ponzi{
    address public owner;
    constructor () public {
        owner = msg.sender;
    } 
}