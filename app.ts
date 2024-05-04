import express from "express";
import { downloadFile, uploadToFirebaseStorage } from "./helpers/storage";
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

    downloadFile(result as string);
  } catch (e) {
    console.error(e);
  }
};

main();
