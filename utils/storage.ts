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
  return response;
}

//FIXME: This function is not working
// We want to use this, to consume content in the app itself - user doesnt need to download the file
export async function downloadFileContent(
  storageBucket: string,
  filepath: string
) {
  const myBucket = storage.bucket(storageBucket);

  const file = myBucket.file(filepath);

  const data = await file.download();
  const csvContent = data[0].toString();

  return csvContent;
}
