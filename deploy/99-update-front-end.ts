import {
    frontEndContractsFile,
    frontEndContractsFile2,
    frontEndAbiLocation,
    frontEndAbiLocation2,
    backendAbiLocation,
    backendContractsFile,
} from "../helper.hardhat.config";
import "dotenv/config";
import fs from "fs";
import { network, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const updateFrontEnd: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...");
        await updateContractAddresses();
        await updateAbi();
        console.log("Front end written!");
    }
};

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketPlace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
    );
    fs.writeFileSync(
        `${backendAbiLocation}NftMarketPlace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
    );
    // fs.writeFileSync(
    //     `${frontEndAbiLocation2}NftMarketPlace.json`,
    //     nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
    // );

    const basicNft = await ethers.getContract("BasicNft");
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
    );
    fs.writeFileSync(
        `${backendAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
    );
    // fs.writeFileSync(
    //     `${frontEndAbiLocation2}BasicNft.json`,
    //     basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
    // );
}

async function updateContractAddresses() {
    const chainId = network.config.chainId!.toString();
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketPlace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketPlace"].push(nftMarketplace.address);
        }
    } else {
        contractAddresses[chainId] = { NftMarketPlace: [nftMarketplace.address] };
    }
    console.log(contractAddresses);
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
    fs.writeFileSync(backendContractsFile, JSON.stringify(contractAddresses));
    // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses));
}
export default updateFrontEnd;
updateFrontEnd.tags = ["all", "frontend"];
