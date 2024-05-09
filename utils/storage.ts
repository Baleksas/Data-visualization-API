import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "csv-storage-project",
  keyFilename: "service-account.json",
});

export const uploadToFirebaseStorage = async (
  bucketName: string,
  filepath: string,
  fileName: string
) => {
  try {
    const gcs = storage.bucket(bucketName);
    const storagepath = `csv_files/${fileName}`;
    const result = await gcs.upload(filepath, {
      destination: storagepath,
      metadata: {
        contentType: "application/csv",
      },
    });

    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const generateV4UploadSignedUrl = async (
  bucketName: string,
  fileName: string
) => {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: "application/csv",
  };
  try {
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const generateV4ReadSignedUrl = async (
  bucketName: string,
  filePath: string
) => {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    return url;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export async function downloadFile(
  bucketName: string,
  fileName: string,
  destFileName: string
) {
  const options = {
    destination: destFileName,
  };
  console.log(bucketName, fileName, destFileName);
  const response = await storage
    .bucket(bucketName)
    .file(fileName)
    .download(options);
  console.log("response", response);
  console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`);
}

//FIXME: This function is not working
export async function downloadFileContent() {
  const myBucket = storage.bucket("csv-storage-bucket");

  const file = myBucket.file("csv_files/sampleDataname.csv");

  file.download().then(function (data) {
    console.log(data);
    const contents = data[0];
    console.log(contents);
    return contents;
  });
}
