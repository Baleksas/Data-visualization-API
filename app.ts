import express, { Request } from "express";
import {
  generateV4ReadSignedUrl,
  generateV4UploadSignedUrl,
  uploadToFirebaseStorage,
} from "./helpers/storage";
import open from "open";
import { GetPresignedUrlBody } from "./types/requests/getPresignedUrl";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const main = async () => {
  try {
    let result = await uploadToFirebaseStorage(
      `csv-storage-bucket`,
      `./3095.csv`,
      `test.csv`
    );

    console.log(result);

    await open(
      await generateV4ReadSignedUrl("csv-storage-bucket", "csv_files/test.csv")
    );
  } catch (e) {
    console.error(e);
  }
};

// main();

app.get("/uploadSignedUrl", async (req: Request<GetPresignedUrlBody>, res) => {
  console.log(req.body);

  let presignedUrl = await generateV4UploadSignedUrl(
    `${req.body.bucketName}`,
    `${req.body.fileName}`
  );

  res.send(presignedUrl);
});

app.get("/readSignedUrl", async (req: Request<GetPresignedUrlBody>, res) => {
  console.log(req.body);
  let presignedUrl = await generateV4ReadSignedUrl(
    req.body.bucketName,
    req.body.filePath
  );

  res.send(presignedUrl);
});
