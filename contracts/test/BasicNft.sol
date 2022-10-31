// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // 从open zeppelin继承的ERC721接口，只需要实现其中的部分功能就可以


contract BasicNft is ERC721{
    uint256 private s_tokenCounter;
    string public constant TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    constructor() ERC721("Dogie", "Dog") {
        s_tokenCounter = 0;
    } // 构造函数，初始化合约名字和简称
    function mintNft() public returns(uint256){
        _safeMint(msg.sender, s_tokenCounter); // 第一个参数代表NFT的拥有者，第二个参数是tokenId，这里我们简单用一个计数器来作为tokenId
        s_tokenCounter += 1;
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        return TOKEN_URI; // 这个函数本质上是找tokenId对应的URI，我们这里就一张图片，所以都用这个就行了
    }

    function getTokenCounter() public view returns(uint256){
        return s_tokenCounter;
    }
}