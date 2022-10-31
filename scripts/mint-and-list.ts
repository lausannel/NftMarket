// mint and List in marketplace
import { ethers, network } from "hardhat";
import { moveBlocks, sleep } from "../utils/move-blocks";

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const basicNft = await ethers.getContract("BasicNft");
    console.log("Minting NFT...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log("Approving Nft...");
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
    await approvalTx.wait(1);
    console.log("Listing Nft...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
    await tx.wait(1);
    console.log("Listed!");
    if (network.config.chainId === 31337) {
        await moveBlocks(2, 1000); // 挖两个块并且等待1秒
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
