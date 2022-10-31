import { ethers, network } from "hardhat";
import { BasicNft, NftMarketPlace } from "../typechain-types";
import { moveBlocks } from "../utils/move-blocks";

const TOKEN_ID = 0;
async function cancel() {
    const nftMarketPlace: NftMarketPlace = await ethers.getContract("NftMarketPlace");
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const tx = await nftMarketPlace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log("NFT listing cancelled");
    if (network.config.chainId === 31337) {
        await moveBlocks(2, 1000);
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
