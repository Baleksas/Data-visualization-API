import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "csv-storage-project",
  keyFilename: "service-account.json",
});

export const uploadToFirebaseStorage = async (
  filepath: string,
  fileName: string
) => {
  try {
    const gcs = storage.bucket("csv-storage-bucket");
    const storagepath = `csv_files/${fileName}`;
    const result = await gcs.upload(filepath, {
      destination: storagepath,
      metadata: {
        contentType: "application/csv",
      },
    });

    return result[0].metadata.mediaLink;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const generateV4ReadSignedUrl = async () => {
  // These options will allow temporary read access to the file
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket("csv-storage-bucket")
      .file("csv_files/3095.csv")
      .getSignedUrl(options);

    return url;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
