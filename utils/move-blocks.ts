import { network } from "hardhat";

function sleep(timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

async function moveBlocks(amount, sleepAmount = 0) {
    console.log(`Moving ${amount} blocks...`);
    for (let i = 0; i < amount; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        }); // 本地才能mine
        if (sleepAmount > 0) {
            console.log(`Sleeping ${sleepAmount}ms...`);
            await sleep(sleepAmount);
        }
    }
}

export { moveBlocks, sleep };
