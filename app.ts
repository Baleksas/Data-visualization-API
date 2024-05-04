import express from "express";
import {
  generateV4ReadSignedUrl,
  uploadToFirebaseStorage,
} from "./helpers/storage";
import open from "open";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const main = async () => {
  try {
    const uploadfilepath = "./3095.csv";
    let result = await uploadToFirebaseStorage(`${uploadfilepath}`, "3095.csv");

    console.log(result);

    await open(await generateV4ReadSignedUrl());
  } catch (e) {
    console.error(e);
  }
};

main();

// TODO: Create an endpoint which would accept a file and upload it to firebase storage by specified filepath and filename

// TODO: Create an endpoint which would download a file by specified filepath and filename from firebase storage
