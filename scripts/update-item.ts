import { ethers, network } from "hardhat";
import { BasicNft, NftMarketPlace } from "../typechain-types";
import { moveBlocks } from "../utils/move-blocks";

const TOKEN_ID = 2;

async function updateItem() {
    const nftMarketPlace: NftMarketPlace = await ethers.getContract("NftMarketPlace");
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const tx = await nftMarketPlace.updateListing(basicNft.address, TOKEN_ID, ethers.utils.parseEther("0.2"));
    await tx.wait(1);
    console.log("NFT listing updated");
    if (network.config.chainId === 31337) {
        await moveBlocks(2, 1000);
    }
}

updateItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
