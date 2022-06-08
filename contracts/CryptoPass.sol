//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

/**
 * Store user password in a secure manner.
 */
contract CryptoPass {
    // store the secrets with user's address
    mapping(address => string[]) _secrets;

    // store the secret with user's address
    function addSecret(string memory secret) public {
        _secrets[msg.sender].push(secret);
    }

    // delete scret by index
    function deleteFile(uint256 index) public {
        if (index < _secrets[msg.sender].length) {
            for (uint256 i = index; i < _secrets[msg.sender].length - 1; i++) {
                _secrets[msg.sender][i] = _secrets[msg.sender][i + 1];
            }
            _secrets[msg.sender].pop();
        }
    }

    // get list of secrets in range of [start, end)
    function getSecretInRange(uint256 start, uint256 end)
        public
        view
        returns (string[] memory)
    {
        uint256 max = end;
        if (max > _secrets[msg.sender].length) {
            max = _secrets[msg.sender].length;
        }
        uint256 itemCount = max - start;
        string[] memory results = new string[](itemCount);
        uint256 index = 0;
        for (uint256 i = start; index < itemCount; i++) {
            results[index] = _secrets[msg.sender][i];
            index += 1;
        }
        return results;
    }

    // get secrets count
    function getSecretSize() public view returns (uint256) {
        return _secrets[msg.sender].length;
    }
}
