// 我们要做的是把文件pin到ipfs上，同时还有json文件，也要pin到ipfs上
import pinataClient from "@pinata/sdk";
import { PinataPinResponse } from "@pinata/sdk";
import path from "path";
import fs from "fs";
import "dotenv/config";

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataClient(pinataApiKey!, pinataApiSecret!);

// images/randomNft
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const files = fs.readdirSync(fullImagesPath);
    // console.log("files", files);
    let responses: PinataPinResponse[] = [];
    console.log("uploading images to pinata...");
    for (let fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(path.join(fullImagesPath, files[fileIndex]));
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile);
            responses.push(response);
        } catch (err) {
            console.log(err);
        }
    }
    return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata);
        return response;
    } catch (err) {
        console.log(err);
    }
}

export { storeImages, storeTokenUriMetadata };
