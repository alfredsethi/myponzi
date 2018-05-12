pragma solidity ^0.4.20;

contract Ponzi {
    address public owner;
    uint price;
    mapping(address => bool) public members;
    mapping(address => uint) public presentedCount;
    constructor () public {
        owner = msg.sender;
        price = 10 finney; //milliether 
    } 
    //amount is in wei
    function withdrwaw(uint amount) public returns(bool){
        //only owner can... 
        if( msg.sender == owner && address(this).balance >= amount )
        {
            msg.sender.transfer(amount);
            return true;
        }
        return false;
    }
    function join(address presentedby) public payable returns(bool) {
        if(msg.value==price){
            //presenter must be a member of the Ponzi's pyramid
            if( members[presentedby]==true ){
                members[msg.sender]==true; // the presented guy join the ponzy's schema
                if( presentedCount[presentedby]%2 == 0){
                    //reward member each couple of prresented new members!
                    presentedby.transfer(price);
                    return true;
                }
            }
        }
        return false;
    }
}