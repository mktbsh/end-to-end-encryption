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
  const [one, two] = stream.tee()

  const [blob, fileType] = await Promise.all([
    new Response(one).blob(),
    fileTypeFromStream(two)
  ])

  return {
    blob,
    ...fileType
  };
}
