// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

contract WacondaToken {
    string public constant name = "Waconda";
    string public constant symbol = "Waconda";
    uint256 public totalSupply;
    uint tokenPrice = 1000000000000000;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor (uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function decimals() public pure returns (uint8) {
        return 2;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function getTokenBalance(address _user) public view returns (uint256 balance) {      
        return balanceOf[_user];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _value = _value;
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        //require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        //allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}