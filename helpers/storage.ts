import { Storage } from "@google-cloud/storage";
import open from "open";

const storage = new Storage({
  projectId: "csv-storage-project",
  keyFilename: "service-account.json",
});

export const uploadToFirebaseStorage = async (
  filepath: string,
  fileName: string
) => {
  try {
    const gcs = storage.bucket("csv-storage-bucket"); // Removed "gs://" from the bucket name
    const storagepath = `csv_files/${fileName}`;
    const result = await gcs.upload(filepath, {
      destination: storagepath,
      predefinedAcl: "publicRead", // Set the file to be publicly readable
      metadata: {
        contentType: "application/csv", // Adjust the content type as needed
      },
    });
    return result[0].metadata.mediaLink;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const downloadFile = async (url: string) => {
  await open(url);
};
