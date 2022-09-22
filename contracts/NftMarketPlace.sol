// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error PriceMustBeAboveZero();


contract NftMarketPlace {



    // main functions
    function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
        if(price <= 0){
            revert PriceMustBeAboveZero();
        }
        // 1. send the nft to the contract  Transfer -> Contract "hold" the NFT
        // 2. Owners can still hold the NFT
        IERC721 nft = IERC721(nftAddress);  // 
    }
}