import { network } from "hardhat";
import { developmentChains } from "../helper.hardhat.config";
import { verify } from "../utils/verify";
import { VERIFICATION_BLOCK_CONFIRMATIONS } from "../helper.hardhat.config";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployBasicNft: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;
    log("------------------------------");
    const args = [];
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitConfirmations || 1,
    });

    // verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(basicNft.address, args);
    }
    log("------------------------------");
};
deployBasicNft.tags = ["basicnft", "main", "all"];

export default deployBasicNft;
