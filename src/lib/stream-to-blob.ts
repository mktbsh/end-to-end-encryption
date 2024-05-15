import { fileTypeFromStream } from "file-type";

interface Result {
  blob: Blob;
  mimeType?: string;
  ext?: string;
}

/**
 * Convert a ReadableStream of Uint8Array to a Blob and determine its MIME type
 * @param stream - The readable stream to convert
 * @returns A promise that resolves to an object containing the Blob and its MIME type
 */
export async function streamToBlob(
  stream: ReadableStream<Uint8Array>
): Promise<Result> {
  const start = performance.now()

  const [one, two] = stream.tee()

  const [blob, fileType] = await Promise.all([
    new Response(one).blob(),
    fileTypeFromStream(two)
  ])

  console.log(fileType)
  console.log(`${performance.now() - start}ms`)

  return {
    blob,
    ...fileType
  };
}

interface GetMimeTypeResult {
  mimeType: string;
  ext?: string;
}

const MIME_IMAGE = "image";
const MIME_VIDEO = "video";
const MIME_APP = "application";

async function getMimeType(blob: Blob, offset: number = 0): Promise<GetMimeTypeResult> {
  console.log(offset);
  if (offset > 4) throw new Error('Illegal offset value');
  const arr = new Uint8Array(await blob.arrayBuffer());
  const header = arr
    .subarray(offset, 4)
    .reduce((a, b) => a + b.toString(16).padStart(2, "0"), "");

  const toResult = (type: string, ext?: string): GetMimeTypeResult => ({
    mimeType: type,
    ext,
  });

  console.log(header);

  let type: string;
  switch (header) {
    case "89504e47":
      type = "png";
      return toResult(`${MIME_IMAGE}/${type}`, type);
    case "47494638":
      type = "gif";
      return toResult(`${MIME_IMAGE}/${type}`, type);
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
      type = "jpeg";
      return toResult(`${MIME_IMAGE}/${type}`, type);
    case "504b0304":
      type = "zip";
      return toResult(`${MIME_APP}/${type}`, type);
    case "25504446":
      type = "pdf";
      return toResult(`${MIME_APP}/${type}`, type);
    case "66747970":
      type = "mp4";
      return toResult(`${MIME_VIDEO}/${type}`, type);
    case "6d6f6f76":
      type = "quicktime";
      return toResult(`${MIME_VIDEO}/${type}`, "mov");
    case "1a45dfa3": // WebM container
      type = "webm";
      return toResult(`${MIME_VIDEO}/${type}`, type);
    default:
      if (offset < 4) {
        return getMimeType(blob, offset + 4);
      }
      type = "octet-stream";
      return toResult(`${MIME_APP}/${type}`);
  }
}
