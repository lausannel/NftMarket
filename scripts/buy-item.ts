import { ethers, network } from "hardhat";
import { BasicNft, NftMarketPlace } from "../typechain-types";
import { moveBlocks } from "../utils/move-blocks";

const TOKEN_ID = 1;

async function buyItem() {
    const nftMarketPlace: NftMarketPlace = await ethers.getContract("NftMarketPlace");
    const basicNft: BasicNft = await ethers.getContract("BasicNft");
    const listing = await nftMarketPlace.getListing(basicNft.address, TOKEN_ID);
    const price = listing.price.toString();
    const tx = await nftMarketPlace.buyItem(basicNft.address, TOKEN_ID, { value: price });
    await tx.wait(1);
    console.log("NFT bought");
    if (network.config.chainId === 31337) {
        await moveBlocks(2, 1000);
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
