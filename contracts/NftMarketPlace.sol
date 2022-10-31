// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error AlreadyListed(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error NotOwner();
error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NoProceeds();

contract NftMarketPlace is ReentrancyGuard {
    struct Listing{
        uint256 price;
        address seller;
    }
    // NFT Contract address -> NFT Token ID -> List

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
    modifier notListed(address nftAddress, uint256 tokenId, address owner){
        Listing memory listing = s_listings[nftAddress][tokenId];
        // 有价格就说明已经被列出来过
        if(listing.price > 0){
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    // seller address -> 赚的钱
    mapping(address => uint256) private s_proceeds;

    // main functions
    // 在市场中列出一个NFT
    function listItem(address nftAddress, uint256 tokenId, uint256 price) external notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender){
        if(price <= 0){
            revert PriceMustBeAboveZero();
        }
        // 1. send the nft to the contract  Transfer -> Contract "hold" the NFT
        // 2. Owners can still hold the NFT
        IERC721 nft = IERC721(nftAddress);  
        if (nft.getApproved(tokenId) != address(this)) {
            // Not approved
            revert NotApprovedForMarketplace();
        }
        // array? mapping
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    // 只有NFT的所有者才能List Item
    modifier isOwner(address nftAddress, uint256 tokenId, address spender){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if(spender != owner){
            revert NotOwner();
        }
        _;
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId)
    nonReentrant {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if(msg.value < listedItem.price){
            // 给的钱不够
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value; // 卖方赚了这么多钱
        delete (s_listings[nftAddress][tokenId]); // 在列出的item中删除这一项
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId); // 转移nft的所有权，放在最后可以防止reentrancy
        // check to make sure the nft is transferred to the buyer
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price <= 0){
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    function cancelListing(address nftAddress, uint256 tokenId) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender){
        delete(s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender){
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory){
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256){
        return s_proceeds[seller];
    }
}