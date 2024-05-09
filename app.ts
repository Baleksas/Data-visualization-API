import express, { Request } from "express";
import {
  downloadFile,
  downloadFileContent,
  generateV4ReadSignedUrl,
  generateV4UploadSignedUrl,
  uploadToFirebaseStorage,
} from "./utils/storage";
import open from "open";
import { GetPresignedUrlBody } from "./types/requests/getPresignedUrl";
import dotenv from "dotenv";
import setupAuth from "./auth";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

setupAuth(app);

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

app.get("/", function (req, res) {
  res.render("pages/auth");
});

app.get("/uploadSignedUrl", async (req: Request<GetPresignedUrlBody>, res) => {
  console.log(req.body);

  let presignedUrl = await generateV4UploadSignedUrl(
    `${req.body.bucketName}`,
    `${req.body.fileName}`
  );

  res.send(presignedUrl);
});

app.get("/readSignedUrl", async (req: Request, res) => {
  const { bucketName, filePath } = req.query;

  if (typeof bucketName !== "string" || typeof filePath !== "string") {
    res.status(400).send("Invalid parameters");
    return;
  }

  let presignedUrl = await generateV4ReadSignedUrl(bucketName, filePath);

  res.send(presignedUrl);
});

app.get("/downloadFile", async (req: Request, res) => {
  const { bucketName, fileName, destFileName } = req.query;

  const content = await downloadFile(
    bucketName as string,
    fileName as string,
    destFileName as string
  );
  // res.send(content);
  res.status(200).send(content);
});
