pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * Educational example
 */
contract Storage {

    uint256 number;

    /**
     * @dev Store value in internal variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return current value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }
}
