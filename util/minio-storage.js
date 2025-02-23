// import * as Minio from "minio";
const Minio = require("minio");
const fs = require("fs");
// import { promisify } from "util";
const { promisify } = require("util");

// MinIO configs
// const {
//   STORAGE_LOCAL_ENDPOINT,
//   STORAGE_ENDPOINT,
//   MINIO_UPLOAD_PORT,
//   USE_SSL,
//   MINIO_UPLOAD_ACCESS_KEY,
//   MINIO_UPLOAD_SECRET_KEY,
//   MINIO_UPLOAD_BUCKET_NAME,
// } = {
//   ...process.env,
// };

// Init minio client
const minioClient = new Minio.Client({
  endPoint: "minio.dxdlabs.dev",
  port: +443,
  useSSL: true,
  accessKey: "AHZQ6BVmTITiqTF0EN5t",
  secretKey: "B76qiQAiiFBfB8knBgtlL7zsOUNHfPZbUOKrMLAa",
});

const bucketName = "kara";

const uploadFileToMinIO = async (file) => {
  const fileName = `${file.originalname}`;
  const metaData = {
    "Content-Type": file.mimetype,
  };
  await minioClient.putObject(
    bucketName,
    fileName,
    file.buffer,
    null,
    metaData
  );

  return `https://minio.dxdlabs.dev/${
    bucketName ? bucketName + "/" : ""
  }${fileName}`;
};

module.exports = {
  uploadFileToMinIO,
};

// /**
//  * list các file trong bucket với prefix chỉ định. (ex: abc_)
//  * @param {string} prefix - prefix để lọc file.
//  * @returns {Promise<string[]>}
//  */
// export async function listFilesWithPrefix(prefix: string): Promise<string[]> {
//   return new Promise((resolve, reject) => {
//     const fileNames: string[] = [];
//     const stream = minioClient.listObjects(bucketName, prefix, true);

//     stream.on("data", (obj) => {
//       fileNames.push(obj.name);
//     });
//     stream.on("end", () => {
//       resolve(fileNames);
//     });
//     stream.on("error", (err) => {
//       reject(err);
//     });
//   });
// }

// export async function downloadFromMinIO(fileName: string): Promise<Readable> {
//   try {
//     // getObject với Promise và trả về stream
//     const stream = await minioClient.getObject(bucketName, fileName);
//     return stream;
//   } catch (err) {
//     throw new Error(`Error downloading file from MinIO: ${err}`);
//   }
// }

// export async function deleteFromMinIO(fileName: string): Promise<void> {
//   try {
//     // xóa file khỏi MinIO
//     await minioClient.removeObject(bucketName, fileName);
//   } catch (err) {
//     throw new Error(`Error deleting file from MinIO: ${err}`);
//   }
// }

// export async function sortChunks(
//   chunkFileNames: string[],
//   chunkPrefix: string
// ): Promise<string[]> {
//   return chunkFileNames.sort((a, b) => {
//     const numA = parseInt(
//       a.replace(chunkPrefix, "").replace(/[^0-9]/g, ""),
//       10
//     );
//     const numB = parseInt(
//       b.replace(chunkPrefix, "").replace(/[^0-9]/g, ""),
//       10
//     );
//     return numA - numB;
//   });
// }
