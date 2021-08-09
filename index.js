const {
  ContainerClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const containerName = "psajeremylearn27";
const account = "psajeremylearn";
const accountKey =
  "QHHUwRBgjq2ReT9DZOZBibx+xjZmPBGFKFUpcqu3aXM0Zfbw3enI378OpOvO+c2o7tpGgjRC3Jx4NS3o7a31vQ==";

const url = `https://${account}.blob.core.windows.net/${containerName}`;

const sharedKey = new StorageSharedKeyCredential(account, accountKey);

async function main() {
  const containerClient = new ContainerClient(url, sharedKey);
  console.log(`Requesting new Container Client`);

  const container = await containerClient.createIfNotExists(containerName);
  if (container.succeeded) {
    console.log(
      `Created container ${containerName} successfully!`,
      container.succeeded,
      container.requestId
    );
  }

  for (let iter = 0; iter < 10; iter++) {
    const blobName = `new blob ${new Date().getTime()}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const content = `I'm a block blog - ${blobName}`;
    const upload = await blockBlobClient.upload(content, content.length);
    console.log(
      `${content} was uploaded successfully \nRequestId: ${upload.requestId}`
    );
  }

  for await (const blob of containerClient.listBlobsFlat()) {
    console.log(
      `${blob.name}, Size: ${blob.properties.contentLength}, Created: ${blob.properties.createdOn}`
    );
  }
}
main().catch((e) => console.error(e));
