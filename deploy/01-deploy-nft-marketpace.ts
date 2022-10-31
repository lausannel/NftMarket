import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../helper.hardhat.config";
import { verify } from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import "dotenv/config";
const deployNftMarketplace: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;
    let args = [];
    const nftMarketplace = await deploy("NftMarketPlace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: waitBlockConfirmations,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(nftMarketplace.address, args);
    }

    log("--------------------");
};

deployNftMarketplace.tags = ["nftmarketplace", "all"];
export default deployNftMarketplace;
